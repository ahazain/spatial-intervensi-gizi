// src/pages/TestSupabase.tsx

import { supabase } from "../lib/Supabase";
import { useEffect } from "react";

export default function TestSupabase() {
  useEffect(() => {
    const test = async () => {
      const { data, error } = await supabase.from("kecamatan").select("*");
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
