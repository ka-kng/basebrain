import React, { useEffect, useState } from "react";
import axios from "axios";

const Rankings = () => {
  const [activeTab, setActiveTab] = useState("batting");
  const [battingRecords, setBattingRecords] = useState([]);
  const [pitchingRecords, setPitchingRecords] = useState([]);

  useEffect(() => {
    // 自チーム全体のランキングデータを取得
    axios.get("/api/ranking").then((res) => {
      setBattingRecords(res.data.battingRecords);
      setPitchingRecords(res.data.pitchingRecords);
    });
  }, []);

  // 打者ランキング集計
  const battingStats = (() => {
    const grouped = {};
    battingRecords
  });

}
