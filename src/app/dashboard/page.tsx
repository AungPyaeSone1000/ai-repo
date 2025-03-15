'use client';
import { useUser } from "@clerk/nextjs";

const DashBoard = () => {
  const { user } = useUser();
  return <div>Hello {user?.firstName}</div>;
};
export default DashBoard;
