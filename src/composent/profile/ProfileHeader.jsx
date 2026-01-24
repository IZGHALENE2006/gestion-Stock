import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";
import ProfileSecurity from "./ProfileSecurity";
import ProfileStats from "./ProfileStats";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#0f172a] p-6 text-white">
      <div className="max-w-6xl mx-auto space-y-6">

        <ProfileHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProfileInfo />
          <ProfileSecurity />
          <ProfileStats />
        </div>

      </div>
    </div>
  );
}
