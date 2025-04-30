import React from "react";
import Layout from "../components/layout/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

function Dashboard() {
  return (
    <Layout>
      <section>
        <p className="text-xl mb-4 font-semibold">Hello, Admin</p>
        <div className="flex  flex-col lg:flex-row gap-4 mb-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl">15</p>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Total Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl">7</p>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Average member per admin</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl">10</p>
            </CardContent>
          </Card>
        </div>

        <div className="">this will be for the chart</div>
      </section>
    </Layout>
  );
}

export default Dashboard;
