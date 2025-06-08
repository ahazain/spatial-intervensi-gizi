import { useNavigate } from "react-router-dom";
import supabase from "./../helper/SupabaseClient";

const DashboardPage = () => {
  const navigate = useNavigate();
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    else {
      navigate("/");
    }
  };

  return (
    <div className="w-full">
      <p className="text-2xl font-bold">Dashboard</p>
      <p className="text-3xl font-semibold">Hello, you are logged in</p>
      <button className="rounded-md border px-4 py-2" onClick={logout}>
        logout
      </button>
    </div>
  );
};

export default DashboardPage;
