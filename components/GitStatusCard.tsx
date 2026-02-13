"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { fetchGitHubCommits, getProjectCommits } from "@/app/actions/git";
import {
  GitBranch,
  ExternalLink,
  RefreshCw,
  GitCommit,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Check,
} from "lucide-react";

interface Commit {
  id: string;
  sha: string;
  message: string;
  author: string;
  committed_at: string;
  url: string;
}

interface GitStatusCardProps {
  projectId: string;
  gitRepo?: string;
  lastCommitMsg?: string;
  lastCommitDate?: string;
}

export function GitStatusCard({
  projectId,
  gitRepo,
  lastCommitMsg,
  lastCommitDate,
}: GitStatusCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [repo, setRepo] = useState(gitRepo || "");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commits, setCommits] = useState<Commit[]>([]);
  const [showAllCommits, setShowAllCommits] = useState(false);
  const [justSynced, setJustSynced] = useState(false);

  // Load commits on mount
  useEffect(() => {
    if (gitRepo) {
      loadCommits();
    }
  }, [gitRepo]);

  const loadCommits = async () => {
    const storedCommits = await getProjectCommits(projectId);
    setCommits(storedCommits);
  };

  const handleSync = async () => {
    if (!repo) return;

    setLoading(true);
    setError(null);

    // Pass token to server action - it will be saved in Supabase
    const result = await fetchGitHubCommits(
      projectId,
      repo,
      token || undefined,
    );

    if (result.success && result.commits) {
      setCommits(result.commits);
      setIsEditing(false);
      setJustSynced(true);
      setTimeout(() => setJustSynced(false), 2000);
    } else {
      setError(result.error || "Failed to sync");
    }

    setLoading(false);
  };

  const displayedCommits = showAllCommits ? commits : commits.slice(0, 5);

  // Editing / Setup view
  if (isEditing || !gitRepo) {
    return (
      <GlassCard className="col-span-2 lg:col-span-1">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-[#F05032]" />
              <h3 className="font-semibold text-white">Git Integration</h3>
            </div>
            {gitRepo && (
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>
            )}
          </div>

          <input
            type="text"
            placeholder="GitHub Repository URL"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-[#F05032]/50 focus:outline-none transition-colors"
          />

          <div className="relative">
            <input
              type="password"
              placeholder="GitHub Token (for private repos)"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-[#F05032]/50 focus:outline-none transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              Token is stored securely in the database
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleSync}
            disabled={loading || !repo}
            className="w-full btn-primary text-sm py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <GitBranch className="w-4 h-4" />
                Connect Repository
              </>
            )}
          </button>
        </div>
      </GlassCard>
    );
  }

  // Connected view with commits
  return (
    <GlassCard className="col-span-2 lg:col-span-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-[#F05032]" />
          <h3 className="font-semibold text-white">Git Status</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSync}
            disabled={loading}
            className={`p-2 rounded-lg transition-all ${
              justSynced
                ? "bg-green-500/20 text-green-400"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
            title="Sync commits"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : justSynced ? (
              <Check className="w-4 h-4" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded hover:bg-white/5 transition-colors"
          >
            Edit
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 px-3 py-2 rounded-lg mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Commits list with fade gradients */}
      <div className="relative">
        {/* Top fade gradient */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-[#111111] to-transparent z-10 pointer-events-none" />

        <div className="space-y-2 max-h-[280px] overflow-y-auto custom-scrollbar py-4 px-1 -mx-1">
          {displayedCommits.length > 0 ? (
            displayedCommits.map((commit) => (
              <a
                key={commit.id}
                href={commit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#1A1A1A] p-3 rounded-lg border-l-2 border-[#F05032] hover:bg-[#222] transition-colors group"
              >
                <div className="flex items-start gap-2">
                  <GitCommit className="w-4 h-4 text-[#F05032] mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-mono break-words line-clamp-2 group-hover:text-[#F05032] transition-colors">
                      {commit.message.split("\n")[0]}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span>{commit.author}</span>
                      <span>•</span>
                      <span>
                        {new Date(commit.committed_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                          },
                        )}
                      </span>
                      <span className="font-mono text-gray-600">
                        {commit.sha.substring(0, 7)}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-[#F05032] shrink-0" />
                </div>
              </a>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <GitCommit className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No commits synced yet</p>
              <button
                onClick={handleSync}
                className="text-[#F05032] text-sm mt-2 hover:underline"
              >
                Sync now
              </button>
            </div>
          )}
        </div>

        {/* Bottom fade gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[#111111] to-transparent z-10 pointer-events-none" />
      </div>

      {/* Show more/less button */}
      {commits.length > 5 && (
        <button
          onClick={() => setShowAllCommits(!showAllCommits)}
          className="w-full mt-3 text-sm text-gray-400 hover:text-white flex items-center justify-center gap-1 py-2 hover:bg-white/5 rounded-lg transition-colors"
        >
          {showAllCommits ? (
            <>
              Show less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show all {commits.length} commits{" "}
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}

      {/* Repo link */}
      <a
        href={repo}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-xs text-[#F05032] hover:underline mt-4 pt-3 border-t border-white/5"
      >
        <ExternalLink className="w-3 h-3 mr-1" />
        View Repository
      </a>
    </GlassCard>
  );
}
