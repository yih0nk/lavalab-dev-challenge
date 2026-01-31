"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Package, Heart, LogOut, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal } from "@/hooks/useAuthModal";
import { getClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface ProfileData {
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

export default function AccountPage() {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const { showLogin } = useAuthModal();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const supabase = getClient();
    const { data } = await supabase
      .from("profiles")
      .select("full_name, email, avatar_url")
      .eq("id", user.id)
      .single();

    if (data) {
      const profileData = data as ProfileData;
      setProfile(profileData);
      setFullName(profileData.full_name || "");
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    const supabase = getClient();

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName } as never)
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated successfully");
      setProfile((prev) => (prev ? { ...prev, full_name: fullName } : null));
      setIsEditing(false);
    }

    setIsSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <User size={48} className="mx-auto text-neutral-300 mb-4" />
          <h1 className="text-2xl font-semibold text-[#181818] mb-2">
            My Account
          </h1>
          <p className="text-neutral-500 mb-6">
            Sign in to view your account details and order history.
          </p>
          <button
            onClick={showLogin}
            className="px-6 py-3 bg-[#181818] text-white font-medium rounded-md hover:bg-[#2D2D2D] transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="text-3xl font-semibold text-[#181818] mb-8">
          My Account
        </h1>

        {/* Profile Section */}
        <div className="bg-neutral-50 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#181818]">
              Profile Information
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-[#181818] hover:underline"
              >
                Edit
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#181818]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full px-4 py-2 border border-neutral-200 rounded-md bg-neutral-100 text-neutral-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#181818] text-white rounded-md hover:bg-[#2D2D2D] transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFullName(profile?.full_name || "");
                  }}
                  className="px-4 py-2 border border-neutral-300 rounded-md hover:bg-neutral-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <span className="text-sm text-neutral-500">Name</span>
                <p className="text-[#181818]">
                  {profile?.full_name || "Not set"}
                </p>
              </div>
              <div>
                <span className="text-sm text-neutral-500">Email</span>
                <p className="text-[#181818]">{user.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <Link
            href="/account/orders"
            className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Package size={20} className="text-neutral-600" />
              <span className="font-medium text-[#181818]">Order History</span>
            </div>
            <ChevronRight size={20} className="text-neutral-400" />
          </Link>

          <Link
            href="/wishlist"
            className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Heart size={20} className="text-neutral-600" />
              <span className="font-medium text-[#181818]">My Wishlist</span>
            </div>
            <ChevronRight size={20} className="text-neutral-400" />
          </Link>

          <button
            onClick={handleSignOut}
            className="flex items-center justify-between w-full p-4 bg-neutral-50 rounded-lg hover:bg-red-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut size={20} className="text-red-500" />
              <span className="font-medium text-red-500">Sign Out</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
