import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-white font-sans text-[--text-main]">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md z-50 shadow-sm">
        <div className="max-w-[1260px] mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[--primary] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">M</span>
            </div>
            <h1 className="text-[--primary] font-bold text-xl tracking-wider">
              西葛西マリーナ歯科医院
            </h1>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8 font-montserrat text-sm font-medium tracking-widest">
            <a href="#" className="hover:text-[--accent] transition-colors">HOME</a>
            <a href="#" className="hover:text-[--accent] transition-colors">ABOUT</a>
            <a href="#" className="hover:text-[--accent] transition-colors">MENU</a>
            <a href="#" className="hover:text-[--accent] transition-colors">STAFF</a>
            <a href="#" className="hover:text-[--accent] transition-colors">CLINIC</a>
          </nav>
          
          <div className="flex items-center gap-4">
            <a href="#" className="hidden md:flex bg-[--accent] text-white px-6 py-3 rounded-full font-bold text-sm tracking-widest hover:opacity-90 transition-opacity">
              WEB予約
            </a>
            <button className="lg:hidden p-2">
              <div className="w-6 h-0.5 bg-black mb-1.5"></div>
              <div className="w-6 h-0.5 bg-black mb-1.5"></div>
              <div className="w-6 h-0.5 bg-black"></div>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 max-w-[1260px] mx-auto min-h-[80vh] flex flex-col justify-center relative overflow-hidden">
        
        {/* 無限スライダー背景 */}
        <div className="absolute top-0 right-[-10%] md:right-0 w-[120%] md:w-[65%] h-full -z-10 md:rounded-l-[100px] overflow-hidden">
          <div className="flex w-[200%] h-full slide-loop">
            {/* 1セット目 */}
            <div className="flex w-1/2 h-full">
              {[1, 2, 3, 4, 5].map((num) => (
                <img key={`first-${num}`} src={`/images/gallery_0${num}.jpg`} alt="" className="w-1/5 h-full object-cover flex-shrink-0" />
              ))}
            </div>
            {/* 2セット目（ループ用） */}
            <div className="flex w-1/2 h-full">
              {[1, 2, 3, 4, 5].map((num) => (
                <img key={`second-${num}`} src={`/images/gallery_0${num}.jpg`} alt="" className="w-1/5 h-full object-cover flex-shrink-0" />
              ))}
            </div>
          </div>
        </div>
        
        <div className="max-w-2xl relative z-10 bg-white/85 p-8 rounded-3xl backdrop-blur-md md:bg-transparent md:p-0 md:backdrop-blur-none mt-16 md:mt-0">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            予防・歯の保存を<br/>第一にした<br/>歯科治療
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
            西葛西駅南口徒歩10分。削る量を最小限に、原因の根本を見つけ、将来を見越した治療を行います。
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="bg-[--primary] text-white px-8 py-4 rounded-full font-bold text-sm tracking-widest hover:opacity-90 transition-opacity inline-flex items-center gap-2">
              初診の方はこちら
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </a>
            <a href="#" className="border-2 border-[--primary] text-[--primary] px-8 py-4 rounded-full font-bold text-sm tracking-widest hover:bg-[--primary] hover:text-white transition-colors inline-flex items-center gap-2">
              当院について
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-[1260px] mx-auto">
          <div className="text-center mb-16">
            <h3 className="font-montserrat text-[--primary] text-sm tracking-[0.2em] mb-2 font-bold">FEATURES</h3>
            <h2 className="text-3xl font-bold">当院の3つの特徴</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "痛みを抑えた治療",
                desc: "麻酔の専門家による痛みに配慮した治療で、歯医者が苦手な方も安心して通えます。"
              },
              {
                title: "わかりやすい説明",
                desc: "現在のお口の状況や治療の選択肢について、モニターを使って視覚的にわかりやすく説明します。"
              },
              {
                title: "専門医による高度治療",
                desc: "インプラントや小児矯正など、各分野の専門的な知識と技術を持った歯科医師が対応します。"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 text-[--primary] rounded-full flex items-center justify-center font-bold text-xl mb-6">
                  {i + 1}
                </div>
                <h4 className="text-xl font-bold mb-4">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Information & Access Section */}
      <section className="py-20 px-4 max-w-[1260px] mx-auto relative">
        {/* 背景装飾 */}
        <div className="absolute top-0 right-0 w-[40%] h-full bg-[--bg-light] -z-10 rounded-l-[100px] opacity-70"></div>
        
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-[#a38e5d]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z"/>
            </svg>
            <p className="font-montserrat text-[#a38e5d] text-sm tracking-[0.2em] font-bold">INFORMATION</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-wider text-[--text-main]">診療時間・アクセス</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* 左側: 連絡先・予約ボタン */}
          <div className="flex flex-col gap-4">
            {/* 電話番号 */}
            <a href="tel:03-3877-1110" className="bg-[#e2dac6] rounded-md p-6 text-center hover:opacity-90 transition-opacity">
              <p className="text-[#6b5c43] font-bold text-sm mb-1 tracking-widest">電話予約・お問い合わせ</p>
              <div className="flex items-baseline justify-center gap-1 text-[#4a4030]">
                <span className="font-montserrat text-xl tracking-widest">TEL</span>
                <span className="font-montserrat text-4xl md:text-5xl tracking-widest">03-3877-1110</span>
              </div>
            </a>
            
            {/* 24時間Web予約 */}
            <a href="#" className="bg-[#a38e5d] text-white rounded-md p-4 text-center hover:bg-[#8f7a4b] transition-colors flex items-center justify-center gap-2 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
              <span className="font-bold text-lg tracking-widest">24時間Web予約</span>
            </a>
            
            {/* メール・LINE相談 */}
            <div className="grid grid-cols-2 gap-4">
              <a href="#" className="bg-[#a38e5d] text-white rounded-md p-4 flex flex-col sm:flex-row items-center justify-center gap-2 hover:bg-[#8f7a4b] transition-colors shadow-sm text-center sm:text-left">
                <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <span className="font-bold text-sm tracking-widest leading-tight">無料<br className="hidden sm:block"/>メール相談</span>
              </a>
              <a href="#" className="bg-[#a38e5d] text-white rounded-md p-4 flex flex-col sm:flex-row items-center justify-center gap-2 hover:bg-[#8f7a4b] transition-colors shadow-sm text-center sm:text-left">
                <svg className="w-6 h-6 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M24 10.3c0-4.4-4.2-8-9.4-8S5.2 5.9 5.2 10.3c0 2 .9 3.8 2.4 5.3-.2.8-.7 2-1.2 2.6-.1.1-.1.2 0 .2.1.1.2 0 .3 0 1.5-.5 3-1.3 4.2-2.1.9.3 1.9.4 2.9.4 5.2 0 9.4-3.6 9.4-8z"/></svg>
                <span className="font-bold text-sm tracking-widest leading-tight">無料<br className="hidden sm:block"/>LINE相談</span>
              </a>
            </div>
          </div>

          {/* 右側: 診療時間テーブル */}
          <div className="text-[--text-main]">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="border-b border-gray-300 text-gray-500 font-bold tracking-widest">
                  <th className="text-left font-normal py-3 w-1/4">診療時間</th>
                  <th className="font-normal py-3">月</th>
                  <th className="font-normal py-3">火</th>
                  <th className="font-normal py-3">水</th>
                  <th className="font-normal py-3">木</th>
                  <th className="font-normal py-3">金</th>
                  <th className="font-normal py-3">土</th>
                  <th className="font-normal py-3">日</th>
                  <th className="font-normal py-3">祝</th>
                </tr>
              </thead>
              <tbody className="text-lg">
                <tr className="border-b border-gray-200">
                  <td className="text-left py-4 text-sm font-montserrat">
                    <span className="text-base tracking-widest font-bold">10:00～13:30</span><br/>
                    <span className="text-gray-400 text-xs tracking-widest">最終受付 13:00</span>
                  </td>
                  <td>●</td>
                  <td>●</td>
                  <td>●</td>
                  <td>◎</td>
                  <td>●</td>
                  <td className="text-gray-400">×</td>
                  <td>▲</td>
                  <td className="text-gray-400">×</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="text-left py-4 text-sm font-montserrat">
                    <span className="text-base tracking-widest font-bold">14:30～18:30</span><br/>
                    <span className="text-gray-400 text-xs tracking-widest">最終受付 18:00</span>
                  </td>
                  <td>●</td>
                  <td>●</td>
                  <td>●</td>
                  <td>◎</td>
                  <td>●</td>
                  <td className="text-gray-400">×</td>
                  <td>▲</td>
                  <td className="text-gray-400">×</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 text-sm text-gray-500 leading-relaxed tracking-wider font-medium space-y-1">
              <p>休診日...土曜・祝日</p>
              <p>▲日曜日は10:00～13:30 / 14:30～17:30</p>
              <p>◎隔週木曜日の10:00～16:00は障害者診療を行っております。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[--primary] text-white py-12 px-4">
        <div className="max-w-[1260px] mx-auto grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">西葛西マリーナ歯科医院</h2>
            <p className="text-gray-300 mb-2">〒134-0088</p>
            <p className="text-gray-300 mb-6">東京都江戸川区西葛西</p>
            <p className="text-2xl font-montserrat font-bold">03-0000-0000</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <div className="flex flex-col gap-2">
              <a href="#" className="hover:text-white transition-colors">HOME</a>
              <a href="#" className="hover:text-white transition-colors">ABOUT</a>
              <a href="#" className="hover:text-white transition-colors">MENU</a>
            </div>
            <div className="flex flex-col gap-2">
              <a href="#" className="hover:text-white transition-colors">STAFF</a>
              <a href="#" className="hover:text-white transition-colors">CLINIC</a>
              <a href="#" className="hover:text-white transition-colors">CONTACT</a>
            </div>
          </div>
        </div>
        <div className="max-w-[1260px] mx-auto mt-12 pt-8 border-t border-white/20 text-center text-sm text-gray-400 font-montserrat">
          &copy; {new Date().getFullYear()} NISHIKASAI MARINA DENTAL CLINIC. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default App
