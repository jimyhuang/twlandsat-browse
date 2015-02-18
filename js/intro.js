var intro = introJs();
intro.setOptions({
  nextLabel: " &rarr; ",
  prevLabel: " &larr; ",
  skipLabel: " 略過介紹 ",
  doneLabel: "開始吧！",
  steps: [
    { 
      intro: "歡迎來到<strong>賽豬公上太空</strong>計畫！這個網頁將會 Demo 計畫產生的資料，將美國的地表研究衛星「Landsat」過去數十年經過台灣的資料，用更簡單的方式讓一般人可以瀏覽比較。"
    },
    {
      element: '#nav',
      intro: "因為 Landsat 衛星每 16 天會經過台灣 5 個地方，你可以從這裡選擇要看哪個位置的地圖。"
    },
    {
      element: '#select-before',
      intro: "選完區域後，已經有地圖的日期，便會顯示在這裡。將左右的日期選擇不同日期，即可看到比較圖"
    },
    {
      element: '.handle-icon',
      position: 'right',
      intro: "你也可以可以隨時用這個指標將要顯示的區域拉動左右側，以觀察兩個時間點的不同"
    }
  ]
});
