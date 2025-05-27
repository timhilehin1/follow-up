import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { supabase } from "../lib/supabase";
import { toast, Toaster } from "sonner";
import { MdErrorOutline } from "react-icons/md";

function Dashboard() {
  const [totalMembers, setTotalMembers] = useState<number>(0);
  const [totalAdmins, setTotalAdmins] = useState<number>(0);
  const [membersPerAdmin, setMembersPerAdmin] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch members
      const membersResponse = await supabase
        .from("members")
        .select("*", { count: "exact" });

      // Fetch admins
      const adminsResponse = await supabase
        .from("admins")
        .select("*", { count: "exact" });

      // Filter for reminder members

      // Check for errors
      if (membersResponse.error) {
        toast.error("Unable to fetch members", {
          icon: <MdErrorOutline size={20} color="#FF3B30" />,
        });
        console.error(membersResponse.error);
      }

      if (adminsResponse.error) {
        toast.error("Unable to fetch admins", {
          icon: <MdErrorOutline size={20} color="#FF3B30" />,
        });
        console.error(adminsResponse.error);
      }

      // Update state with results
      const membersCount = membersResponse.data?.length || 0;
      const adminsCount = adminsResponse.data?.length || 0;

      setTotalMembers(membersCount);
      setTotalAdmins(adminsCount);

      // Calculate members per admin (avoid division by zero)
      if (adminsCount > 0) {
        setMembersPerAdmin(Math.round(membersCount / adminsCount));
      } else {
        setMembersPerAdmin(0);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
      toast.error("Failed to load dashboard data", {
        icon: <MdErrorOutline size={20} color="#FF3B30" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <section className="p-4">
        <p className="text-xl mb-4 font-semibold">Hello, Admin👋</p>

        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="">{isLoading ? "Loading..." : totalMembers}</p>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Total Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="">{isLoading ? "Loading..." : totalAdmins}</p>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Average member per admin</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="">{isLoading ? "Loading..." : membersPerAdmin}</p>
            </CardContent>
          </Card>
        </div>

        <div className="h-[5rem] flex justify-center items-center">
          {/* Chart coming Soon... */}
        </div>
      </section>
      <Toaster position="top-right" />
    </Layout>
  );
}

export default Dashboard;
