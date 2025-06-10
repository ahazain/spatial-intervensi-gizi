import supabase from "./../helper/SupabaseClient";
import { useEffect } from "react";

export default function TestSupabase() {
  useEffect(() => {
    const test = async () => {
      const { data, error } = await supabase.from("balita").select("*");
      if (error) {
        console.error("Error:", error.message);
      } else {
        console.log("Data:", data);
      }
    };
    test();
  }, []);

  return <div>Test Supabase - Cek console</div>;
}
