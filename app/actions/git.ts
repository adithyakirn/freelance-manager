"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
}

interface Commit {
  id: string;
  sha: string;
  message: string;
  author: string;
  committed_at: string;
  url: string;
}

// Parse GitHub repo URL to get owner/repo
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    // Handle various GitHub URL formats
    // https://github.com/owner/repo
    // https://github.com/owner/repo.git
    // https://github.com/owner/repo/tree/main
    const patterns = [
      /github\.com\/([^/]+)\/([^/.\s]+)/,
      /github\.com:([^/]+)\/([^/.\s]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return { owner: match[1], repo: match[2].replace(".git", "") };
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Save GitHub token to project in Supabase
export async function saveGitHubToken(
  projectId: string,
  token: string,
): Promise<void> {
  const supabase = await createClient();

  await supabase
    .from("projects")
    .update({ github_token: token })
    .eq("id", projectId);

  revalidatePath(`/projects/${projectId}`);
}

// Get GitHub token for a project
export async function getGitHubToken(
  projectId: string,
): Promise<string | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("projects")
    .select("github_token")
    .eq("id", projectId)
    .single();

  return data?.github_token || null;
}

// Fetch commits from GitHub API
export async function fetchGitHubCommits(
  projectId: string,
  repoUrl: string,
  newToken?: string, // Optional new token to save
): Promise<{ success: boolean; error?: string; commits?: Commit[] }> {
  const parsed = parseGitHubUrl(repoUrl);

  if (!parsed) {
    return { success: false, error: "Invalid GitHub URL format" };
  }

  const { owner, repo } = parsed;
  const supabase = await createClient();

  try {
    // Save new token if provided
    if (newToken) {
      await saveGitHubToken(projectId, newToken);
    }

    // Get token from database
    const token = newToken || (await getGitHubToken(projectId));

    // Fetch commits from GitHub API
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "FreelanceManager",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=50`,
      { headers, next: { revalidate: 0 } },
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return {
          success: false,
          error:
            "Access denied. Please configure a GitHub token for private repos.",
        };
      }
      if (response.status === 404) {
        return {
          success: false,
          error:
            "Repository not found. Check the URL or ensure you have access.",
        };
      }
      return {
        success: false,
        error: `GitHub API error: ${response.status}`,
      };
    }

    const githubCommits: GitHubCommit[] = await response.json();

    // Store commits in database (upsert to avoid duplicates)
    const commitsToStore = githubCommits.map((c) => ({
      project_id: projectId,
      sha: c.sha,
      message: c.commit.message,
      author: c.commit.author.name,
      committed_at: c.commit.author.date,
      url: c.html_url,
    }));

    // Upsert commits
    for (const commit of commitsToStore) {
      await supabase.from("commits").upsert(commit, {
        onConflict: "project_id,sha",
        ignoreDuplicates: true,
      });
    }

    // Update project with latest commit info
    if (githubCommits.length > 0) {
      const latest = githubCommits[0];
      await supabase
        .from("projects")
        .update({
          git_repo: repoUrl,
          last_commit_msg: latest.commit.message.split("\n")[0], // First line only
          last_commit_date: latest.commit.author.date,
        })
        .eq("id", projectId);
    }

    revalidatePath(`/projects/${projectId}`);

    // Return stored commits
    const { data: commits } = await supabase
      .from("commits")
      .select("*")
      .eq("project_id", projectId)
      .order("committed_at", { ascending: false });

    return { success: true, commits: commits || [] };
  } catch (error) {
    console.error("Error fetching commits:", error);
    return {
      success: false,
      error: "Failed to fetch commits. Please try again.",
    };
  }
}

// Get stored commits for a project
export async function getProjectCommits(projectId: string): Promise<Commit[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("commits")
    .select("*")
    .eq("project_id", projectId)
    .order("committed_at", { ascending: false });

  return data || [];
}

// Save GitHub token to project (stored securely in env for now)
export async function updateGitRepo(
  projectId: string,
  repoUrl: string,
): Promise<void> {
  const supabase = await createClient();

  await supabase
    .from("projects")
    .update({ git_repo: repoUrl })
    .eq("id", projectId);

  revalidatePath(`/projects/${projectId}`);
}
