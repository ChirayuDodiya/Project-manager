export function UserRowSkeleton() {
  return (
    <div className="flex items-center gap-6 py-3 px-6 bg-[#1e1e1e] border border-[#333]/40 rounded-2xl animate-pulse select-none">
      {/* User profile details skeleton */}
      <div className="flex-1 flex flex-col justify-center min-w-0 space-y-2">
        {/* Name placeholder */}
        <div className="h-5 bg-[#2d2d2d] rounded-md w-1/3" />
        {/* Email placeholder */}
        <div className="h-3.5 bg-[#252525] rounded-md w-1/2" />
      </div>

      {/* Role selection dropdown skeleton */}
      <div className="w-48 flex justify-center">
        <div className="w-full h-9 bg-[#2d2d2d] rounded-xl border border-zinc-800" />
      </div>

      {/* Soft delete/restore button skeleton */}
      <div className="w-8 flex justify-end">
        <div className="w-8 h-8 bg-[#2d2d2d] rounded-lg border border-zinc-800" />
      </div>
    </div>
  );
}

export default UserRowSkeleton;
