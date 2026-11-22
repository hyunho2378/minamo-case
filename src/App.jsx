import React, { useState } from 'react';
import {
  LangCtx, Ja, Rise, Fig, CoverInk, Compare, KeywordCell, Marquee, SceneDraw, PhoneDemo,
  useLightHeader, useMemoIds,
} from './components.jsx';

/* GitHub Pages 하위 주소(/minamo-case/)에서도 그림이 깨지지 않게 base 를 붙인다. */
const M = `${import.meta.env.BASE_URL}media/`;

/* 머리 위 글자가 밝은 면 위에 올라가면 검정으로 바뀐다. */
const LIGHT_IDS = ['s-intro', 's-research', 's-drivers', 's-loop', 's-target', 's-base', 's-brand', 's-form', 's-pen', 's-mobile'];

export default function App() {
  const [lang, setLangState] = useState('ko');

  /* 판을 바꿀 때 일본어 줄이 붙어 글이 길어지므로, 보고 있던 섹션에 화면을 다시 맞춘다. */
  function setLang(next) {
    const secs = [...document.querySelectorAll('main > section')];
    const y = window.scrollY;
    let idx = 0;
    let inner = 0;
    secs.forEach((s, i) => {
      const top = s.getBoundingClientRect().top + window.scrollY;
      if (top <= y + 2) { idx = i; inner = y - top; }
    });
    setLangState(next);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const s2 = document.querySelectorAll('main > section')[idx];
      if (!s2) return;
      const top2 = s2.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, Math.max(0, Math.round(top2 + inner)));
    }));
  }

  const bi = lang === 'bi';
  const light = useLightHeader(useMemoIds(LIGHT_IDS));

  return (
    <LangCtx.Provider value={lang}>
      <header className={`hd ${light ? 'on-light' : ''}`}>
        <div className="hd-left">
          <span className="hd-mark"><i className="hd-dot" />MINAMO</span>
          <span className="hd-sub">XR Drawing Glass, 2026 한림대학교 캡스톤디자인</span>
        </div>
        <div className="lang-wrap" role="group" aria-label="언어 전환">
          <button className={`lang ${!bi ? 'sel' : ''}`} onClick={() => setLang('ko')} aria-pressed={!bi}>KO</button>
          <button className={`lang ${bi ? 'sel' : ''}`} onClick={() => setLang('bi')} aria-pressed={bi}>KO+JA</button>
        </div>
      </header>

      <main>
        {/* 01 표지 */}
        <section className="cover">
          <div className="cover-img"><img src={M + 'cover.webp'} alt="연두 바이저를 쓰고 펜으로 수면에 그리는 사람" /></div>
          <div className="cover-ring" aria-hidden="true" />
          <CoverInk>
            <div className="cover-grid">
              <div className="cover-top">
                <span>2026 Hallym Univ.<br />Capstone Design</span>
                <span>XR Drawing Glass<br />: MINAMO</span>
              </div>
              <div className="cover-mid">
                <div className="cover-concept">
                  <span className="eyebrow">서비스 컨셉<Ja>サービスコンセプト</Ja></span>
                  <p className="h3">수면에 번지는 밤의 그림<Ja>水面に広がる夜の絵</Ja></p>
                </div>
                <div className="cover-right">
                  <p className="cap">후쿠오카 오호리 공원과 舞鶴公園의 밤<Ja>福岡 大濠公園と舞鶴公園の夜</Ja></p>
                </div>
              </div>
              <p className="cover-word">MINAMO</p>
            </div>
          </CoverInk>
        </section>

        {/* 02 개요 */}
        <section className="sec paper pad" id="s-intro">
          <div className="wrap">
            <Rise>
              <span className="eyebrow">Overview</span>
              <h2 className="h2">
                밤의 공원 수면이 그림판이 됩니다.
                <Ja big>夜の公園の水面が絵を描く場になります。</Ja>
              </h2>
              <p className="body mt-m" style={{ maxWidth: '62ch' }}>
                MINAMO는 투과형 XR 바이저와 펜 두 자루로 도심 물가의 밤 수면에 그리는 서비스입니다.
                지나던 시민은 휴대폰으로 같은 수면을 봅니다.
                平安時代의 墨流し를 후쿠오카의 밤 공원으로 옮겼습니다.
                <Ja big>
                  MINAMOは透過型XRバイザーとペン2本で、都心の水辺の夜の水面に描くサービスです。
                  通りがかった市民はスマホで同じ水面を見ます。
                  平安時代の墨流しを福岡の夜の公園へ移しました。
                </Ja>
              </p>
            </Rise>
          </div>
          <Rise delay={0.08} className="mt-l out">
            <Fig src={M + 'visor_hero.webp'} full alt="투과형 XR 바이저를 쓴 사람" ratio="ratio-wide" />
            <p className="cap bleed-cap">투과형 렌즈 한 장으로 발밑과 난간이 그대로 보인다</p>
          </Rise>
        </section>

        {/* 03 문학 모티프 */}
        <section className="sec dark pad-b0" style={{ paddingTop: 'var(--sec)' }}>
          <div className="wrap" style={{ paddingLeft: 'var(--pad)', paddingRight: 'var(--pad)' }}>
            <Rise className="head">
              <div>
                <span className="eyebrow">Literature</span>
                <span className="label">문학 모티프<Ja>文学モチーフ</Ja></span>
              </div>
              <div className="waka">
                <p className="waka-jp" lang="ja">
                  はるが<b>すみ</b><br /><b>なかし</b>かよひぢ<br />なかりせば<br />あきくるかりは<br />かへらざらまし
                </p>
                <div>
                  <p className="h3 lime">古今和歌集 권10 物名 465  在原滋春</p>
                  <p className="h3 mt-s">
                    봄 안개 속에 오가는 길이 없었다면<br />가을에 온 기러기는<br />돌아가지 않았을 텐데.
                    <Ja big>春霞の中に通い路がなかったなら<br />秋に来た雁は<br />北へ帰らなかっただろうに。</Ja>
                  </p>
                  <p className="body mt-m">
                    첫 구와 둘째 구에 걸친 「すみなかし」 안에 제목 墨流し를 숨긴 말놀이 노래입니다.
                    平安 사람들은 墨流し 무늬를 뜬 종이 위에 와카를 적었습니다.
                    <Ja>
                      初句と二句にまたがる「すみなかし」に題の墨流しを隠した物名歌です。
                      平安の人々は墨流しの模様を写した紙に和歌を書きました。
                    </Ja>
                  </p>
                </div>
              </div>
            </Rise>
          </div>
          <div className="mt-l">
            <Fig src={M + 'waka_paper.webp'} full ratio="ratio-band"
              alt="墨流し 무늬 종이에 적은 와카"
              className="bleed" />
            <p className="cap" style={{ padding: '12px var(--pad) 0' }}>
              西本願寺本三十六人家集 躬恒集(1112년 무렵, 국보). 출처: Wikimedia Commons, 36poets collection MITSUNE1L(퍼블릭 도메인)
            </p>
          </div>
          <div style={{ height: 'calc(var(--sec) * 0.55)' }} />
        </section>

        {/* 04 조사 방법 */}
        <section className="sec white pad" id="s-research">
          <div className="wrap">
            <Rise className="head">
              <div>
                <span className="eyebrow">Research</span>
                <span className="label">조사 방법<Ja>調査方法</Ja></span>
              </div>
              <div>
                <h2 className="h2">네 가지 방법으로 조사했습니다.<Ja big>四つの方法で調査しました。</Ja></h2>
              </div>
            </Rise>

            <Rise delay={0.1} className="mt-m">
              <div className="rule" />
              <ul className="steps mt-m">
                {[
                  ['01', '문헌 조사', '文献調査', '古今和歌集 465번과 三十六人家集에서 墨流し와 길의 노래를 찾았습니다.', '古今和歌集465番と三十六人家集から、墨流しと道の歌を探しました。'],
                  ['02', '통계 조사', '統計調査', '내각관방과 후쿠오카시 통계, 정주 논문에서 청년 이동과 공원 이용을 정리했습니다.', '内閣官房と福岡市の統計、定住研究から若者の移動と公園利用をまとめました。'],
                  ['03', '사례 조사', '事例調査', '宙-SORA-와 포켓몬 GO 행사, 위치 기반 게임 연구를 비교했습니다.', '宙-SORA-とポケモンGOイベント、位置情報ゲーム研究を比べました。'],
                  ['04', '현장 조사', '現地調査', '11월 22일 오호리 공원의 낮과 밤을 쟀습니다. 11월 23일에는 구마모토대 학생 반응을 듣습니다.', '11月22日に大濠公園の昼と夜を測りました。11月23日には熊本大学で学生の反応を聞きます。'],
                ].map(([n, t, tj, d, dj]) => (
                  <li key={n}>
                    <span className="step-n">{n}</span>
                    <p className="step-t">{t}<Ja>{tj}</Ja></p>
                    <p className="cap">{d}<Ja>{dj}</Ja></p>
                  </li>
                ))}
              </ul>
            </Rise>
          </div>
          <Rise delay={0.06} className="mt-l out">
            <div className="bleed-grid bleed-2">
              <div className="fig ratio-32"><img src={M + 'loop.webp'} alt="오호리 공원 순환로" loading="lazy" /></div>
              <div className="fig ratio-32"><img src={M + 'kumamoto.webp'} alt="구마모토대학 본부 건물" loading="lazy" /></div>
            </div>
            <p className="cap bleed-cap">
              11월 22일 오호리 공원 순환로와 일본정원, 11월 23일 구마모토대학.
              사진: Hirho, Ōhori Park Loop Path(CC BY 4.0). hyolee2, Kumamoto University Headquarters building 2021(CC BY-SA 4.0), Wikimedia Commons
            </p>
          </Rise>
        </section>

        {/* 05 청년 유출 */}
        <section className="sec dark" style={{ paddingTop: 'var(--sec)' }}>
          <div className="wrap" style={{ paddingLeft: 'var(--pad)', paddingRight: 'var(--pad)' }}>
            <Rise className="head">
              <div>
                <span className="eyebrow">Problem 1</span>
                <span className="label">청년 유출<Ja>若者の流出</Ja></span>
              </div>
              <div>
                <h2 className="h2">
                  후쿠오카시 대학 졸업생 11,691명 가운데 54.1%가 규슈 밖에서 첫 직장을 잡았습니다.
                  <Ja big>福岡市の大学卒業生11,691人のうち54.1%が九州外で最初の就職をしました。</Ja>
                </h2>
                <p className="body mt-m" style={{ maxWidth: '58ch' }}>
                  시내에 남은 졸업생은 26.6%입니다. 구마모토대 졸업 취직자의 현내 취직은 34%입니다.
                  규슈에서 가장 큰 도시도 지방 국립대도 졸업과 함께 청년을 보냅니다.
                  <Ja>
                    市内に残ったのは26.6%です。熊本大学の卒業就職者の県内就職は34%です。
                    九州最大の都市も地方の国立大学も、卒業とともに若者を送り出しています。
                  </Ja>
                </p>
              </div>
            </Rise>
          </div>
          <Rise delay={0.06} className="mt-l">
            <Fig src={M + 'hakata.webp'} full ratio="ratio-band" alt="하카타역 신칸센 승강장" position="50% 60%" />
            <p className="cap" style={{ padding: '12px var(--pad) 0' }}>
              출처: 후쿠오카시, 기본계획 참고 데이터집(2026. 7.). RKK 구마모토방송, 구마모토대 졸업식 보도(2025. 3. 25.).
              사진: そらみみ, Platform of Hakata Station Shinkansen 2(CC BY-SA 4.0), Wikimedia Commons
            </p>
          </Rise>
          <div style={{ height: 'calc(var(--sec) * 0.55)' }} />
        </section>

        {/* 06 떠나게 하는 요인 */}
        <section className="sec paper pad" id="s-drivers">
          <div className="wrap">
            <Rise className="head">
              <div>
                <span className="eyebrow">Drivers</span>
                <span className="label">떠나게 하는 요인<Ja>若者が去る要因</Ja></span>
              </div>
              <div>
                <h2 className="h2">
                  도쿄로 옮긴 청년은 일과 즐길 거리를 이유로 꼽았습니다.
                  <Ja big>東京へ移った若者は、仕事と楽しめる場を理由に挙げました。</Ja>
                </h2>
              </div>
            </Rise>

            <Rise delay={0.1} className="mt-m">
              <div className="rule" />
              <ul className="stat-row mt-m">
                {[
                  ['도쿄권에 보람 있는 일이 많다고 답한 비율은 35.4%입니다.', '東京圏にやりがいのある仕事が多いと答えた割合は35.4%です。'],
                  ['오락과 문화 기회가 많다고 답한 비율은 30.8%입니다.', '娯楽と文化の機会が多いと答えた割合は30.8%です。'],
                  ['18세가 도시를 고르는 이유 2위는 오락입니다.', '18歳が都市を選ぶ理由の2位は娯楽です。'],
                ].map(([t, tj]) => (
                  <li key={t}><p className="stat-t">{t}<Ja>{tj}</Ja></p></li>
                ))}
              </ul>
              <p className="body mt-m" style={{ maxWidth: '62ch' }}>
                일자리는 기업과 정부 지원이 맡는 영역입니다. MINAMO는 도시 공간이 바로 채울 수 있는 즐길 거리를 맡습니다.
                <Ja>仕事は企業と行政の支援が担う領域です。MINAMOは都市空間がすぐに満たせる楽しみを担います。</Ja>
              </p>
              <p className="cap mt-s">
                출처: 일본 내각관방, 若年層における東京圏・地方圏移動に関する意識調査(2019. 4.~5.). 日本財団, 18歳意識調査 第29回(2020. 9.)
              </p>
            </Rise>
          </div>
          <Rise delay={0.06} className="mt-l out">
            <Fig src={M + 'shibuya.webp'} full alt="밤의 시부야 교차로" ratio="ratio-wide" />
            <p className="cap bleed-cap">사진: Joli Rumi, Shibuya crossing at night(CC BY-SA 4.0), Wikimedia Commons</p>
          </Rise>
        </section>

        {/* 07 밤의 공원 */}
        <section className="sec dark">
          <Fig src={M + 'nightpark.webp'} full ratio="ratio-band" alt="가로등만 켜진 밤의 공원 산책로" />
          <div className="pad">
            <div className="wrap">
              <Rise className="head">
                <div>
                  <span className="eyebrow">Problem 2</span>
                  <span className="label">밤의 공원<Ja>夜の公園</Ja></span>
                </div>
                <div>
                  <h2 className="h2">
                    오호리와 舞鶴公園의 이용 목적은 산책이 57.8%입니다.
                    <Ja big>大濠公園と舞鶴公園の利用目的は散歩が57.8%です。</Ja>
                  </h2>
                  <p className="body mt-m" style={{ maxWidth: '58ch' }}>
                    이벤트와 강좌는 10.9%에 그칩니다. 시민 32.2%는 나이트 액티비티가 있으면 이용하겠다고 답했습니다.
                    밤에 함께 즐길 문화가 아직 없습니다.
                    <Ja>
                      イベントと講座は10.9%にとどまります。市民の32.2%はナイトアクティビティがあれば利用したいと答えました。
                      夜に共に楽しむ文化がまだありません。
                    </Ja>
                  </p>
                  <div className="rule mt-l" />
                  <ul className="stat-row mt-m">
                    {[
                      ['청년이 즐길 밤 문화가 필요합니다.', '若者が楽しめる夜の文化が必要です。'],
                      ['보고 끝나지 않는 체험이 필요합니다.', '見るだけで終わらない体験が必要です。'],
                      ['처음 만난 사람과 함께할 계기가 필요합니다.', '初めて会う人と一緒になるきっかけが必要です。'],
                    ].map(([t, tj]) => (
                      <li key={t}><p className="h3">{t}<Ja>{tj}</Ja></p></li>
                    ))}
                  </ul>
                  <p className="cap mt-m">출처: 후쿠오카시, 2026년도 제1회 시정 앙케트(N=547)</p>
                </div>
              </Rise>
            </div>
          </div>
        </section>

        {/* 08 정주 고리 */}
        <section className="sec white pad" id="s-loop">
          <div className="wrap">
            <Rise className="head">
              <div>
                <span className="eyebrow">Insight</span>
                <span className="label">정주 고리<Ja>定住へのつながり</Ja></span>
              </div>
              <div>
                <h2 className="h2">
                  즐기며 나가는 지역 활동이 정주 의향으로 이어집니다.
                  <Ja big>楽しんで参加する地域活動が定住意向につながります。</Ja>
                </h2>
                <p className="body mt-m" style={{ maxWidth: '58ch' }}>
                  20~30대 정주 의향과 통계적으로 이어진 요인은 지역 활동 하나였고 오즈비는 2.08입니다.
                  <Ja>20〜30代の定住意向と統計的に関連した要因は地域活動のみで、オッズ比は2.08です。</Ja>
                </p>
              </div>
            </Rise>

            <Rise delay={0.08} className="mt-l">
              <div className="rule" />
              <ul className="stat-row mt-m">
                {[
                  ['후쿠오카 시민 61.0%는 지난 1년 지역 활동에 나가지 않았습니다.', '福岡市民の61.0%はこの1年間、地域活動に参加していません。'],
                  ['참여한 활동 1위는 환경 미화입니다.', '参加した活動の1位は環境美化です。'],
                  ['계기와 방법을 몰라 못 나갔다는 답이 38.4%입니다.', 'きっかけや方法がわからず参加できなかった答えが38.4%です。'],
                ].map(([t, tj]) => (
                  <li key={t}><p className="stat-t">{t}<Ja>{tj}</Ja></p></li>
                ))}
              </ul>
              <p className="cap mt-m">출처: 上野正也 외, 都市計画論文集 60巻1号(2025. 4.). 후쿠오카시, 令和6年度 市政アンケート調査(2024. 8.)</p>
            </Rise>
          </div>
        </section>

        {/* 09 문제 정의 */}
        <section className="sec dark pad stage">
          <img className="stage-bg" src={M + 'asis.webp'} alt="산책로만 쓰이는 밤의 연못" loading="lazy" />
          <div className="wrap stage-in">
            <Rise>
              <span className="eyebrow">Definition</span>
              <h2 className="h2 mt-s">
                후쿠오카 청년에게는 산책뿐인 밤 공원에서 처음 만난 사람과 직접 만들고 함께 즐기는 밤 문화가 필요합니다.
                <Ja big>福岡の若者には、散歩だけの夜の公園で初めて会う人と自らつくり、共に楽しむ夜の文化が必要です。</Ja>
              </h2>
            </Rise>
            <Rise delay={0.1} className="mt-l">
              <div className="rule" />
              <p className="eyebrow mt-m">How Might We</p>
              <p className="h3">
                도심 물가의 밤 수면을 청년이 직접 그리고 지나던 시민이 함께 보는 무대로 바꾸는 방법
                <Ja big>都心の水辺の夜の水面を、若者が自ら描き、通りがかった市民が一緒に見る舞台に変える方法</Ja>
              </p>
            </Rise>
          </div>
        </section>

        {/* 10 대상과 가능성 */}
        <section className="sec paper pad" id="s-target">
          <div className="wrap">
            <Rise className="head">
              <div>
                <span className="eyebrow">Target</span>
                <span className="label">대상<Ja>対象</Ja></span>
              </div>
              <div>
                <h2 className="h2">
                  주말 밤 즐길 거리를 찾는 지방 도시 청년이 함께 만드는 XR 경험입니다.
                  <Ja big>週末の夜に楽しみを探す地方都市の若者が共につくるXR体験です。</Ja>
                </h2>
                <ul className="stat-row mt-m">
                  {[
                    ['주말 밤에 갈 곳이 없는 혼자 사는 대학생', '週末の夜に行く場所がない一人暮らしの大学生'],
                    ['즐길 거리를 찾아 도쿄행을 생각하는 졸업 예정자', '楽しめる場を求めて東京行きを考える卒業予定者'],
                    ['밤 산책 길에 할 일을 찾는 시민', '夜の散歩中にすることを探す市民'],
                  ].map(([t, tj]) => (
                    <li key={t} className="h3">{t}<Ja>{tj}</Ja></li>
                  ))}
                </ul>
              </div>
            </Rise>

            <Rise delay={0.08} className="mt-m">
              <div className="rule" />
              <div className="head mt-m">
                <div>
                  <span className="eyebrow">Possibility</span>
                  <span className="label">가능성<Ja>可能性</Ja></span>
                </div>
                <div>
                  <h2 className="h2">
                    후쿠오카의 밤 공원과 위치 놀이에는 이미 사람이 모입니다.
                    <Ja big>福岡の夜の公園と位置情報の遊びには、すでに人が集まっています。</Ja>
                  </h2>
                  <p className="body mt-m" style={{ maxWidth: '58ch' }}>
                    지금 체험은 보고 끝나서 직접 그리고 함께 섞는 다음 단계를 MINAMO가 엽니다.
                    <Ja>今の体験は見るだけで終わるため、自ら描き共に混ざる次の段階をMINAMOが開きます。</Ja>
                  </p>
                </div>
              </div>
            </Rise>

          </div>
          <Rise delay={0.12} className="mt-m out">
            <div className="bleed-grid bleed-2">
              <div className="fig ratio-32"><img src={M + 'bridge.webp'} alt="오호리 공원 일본정원의 밤" loading="lazy" /></div>
              <div className="fig ratio-32"><img src={M + 'yokohama.webp'} alt="위치 기반 게임 현장 행사" loading="lazy" /></div>
            </div>
            <div className="wrap bleed-cap">
              <div className="grid-2">
                <p className="cap">오호리 일본정원 야간 아트 宙-SORA-는 1년에 67,500명이 봤습니다. 사진: Ludovic Lubeigt, Bridge Fukuoka(CC BY-SA 2.0), Wikimedia Commons</p>
                <p className="cap">舞鶴公園 포켓몬 GO 행사에는 3.6만 명이 현장을 찾았습니다. 레이드 응답자 510명 가운데 처음 만난 사람과 함께 플레이한 비율은 75%입니다. 사진: kkairri, Pokémon GO PARK 요코하마 행사(CC BY-SA 3.0), Wikimedia Commons</p>
              </div>
              <p className="cap mt-s">출처: 오호리 공원 관리사무소 공지(2026. 7. 23.). Scopely, Pokémon GO Wild Area Fukuoka 보고(2025. 8. 26.). Bhattacharya 외, CHI 2019</p>
            </div>
          </Rise>
        </section>

        {/* 11 실행 기반 */}
        <section className="sec white pad" id="s-base">
          <div className="wrap">
            <Rise className="head">
              <div>
                <span className="eyebrow">Feasibility</span>
                <span className="label">실행 기반<Ja>実行基盤</Ja></span>
              </div>
              <div>
                <h2 className="h2">
                  후쿠오카 안에서 작가와 예산, 관람 기술을 찾았습니다.
                  <Ja big>福岡の中で作り手と予算、鑑賞技術を見つけました。</Ja>
                </h2>
              </div>
            </Rise>
            <Rise delay={0.08} className="mt-l out">
              <div className="bleed-grid bleed-3">
                {[
                  ['tenjin', '게임 관련 사업자 38곳', 'ゲーム関連事業者38社', '종사자 2,693명이 일하는 후쿠오카에는 시즌 작품을 그릴 작가와 기술 인력이 있습니다.', '従事者2,693人が働く福岡には、シーズン作品を描く作り手と技術者がいます。', '사진: そらみみ, Meijidori Street in Tenjin Area at night(CC BY-SA 4.0), Wikimedia Commons'],
                  ['dusk', '이벤트 20건에서 25건', 'イベント20件から25件へ', '후쿠오카시 기본계획의 크리에이티브 참여 이벤트 목표에 MINAMO 시즌을 더할 수 있습니다.', '福岡市基本計画のクリエイティブ参加イベント目標にMINAMOのシーズンを加えられます。', '사진: t.ashihara, Ōhorikōen(CC BY-SA 3.0), Wikimedia Commons'],
                  ['pgofest', 'QR 한 번으로 관람', 'QR一回で鑑賞', '앱 설치 없이 휴대폰 웹 XR로 열리므로 휴대폰 하나만 있으면 누구나 볼 수 있습니다.', 'アプリ不要でスマホのWeb XRで開くため、スマホ一台あれば誰でも見られます。', '사진: Jim Trottier, Pokemon go fest(CC BY-SA 2.0), Wikimedia Commons'],
                ].map(([img, t, tj, d, dj, cr]) => (
                  <div className="fig ratio-sq" key={img}>
                    <img src={M + img + '.webp'} alt={t} loading="lazy" />
                    <div className="over-text">
                      <p className="step-t">{t}<Ja>{tj}</Ja></p>
                      <p className="cap over-cap">{d}<Ja>{dj}</Ja></p>
                      <p className="cap over-cap" style={{ marginTop: 8 }}>{cr}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="cap bleed-cap">출처: 후쿠오카시, 기본계획 목표 5와 목표 7 평가(2026. 9.)</p>
            </Rise>
          </div>
        </section>

        {/* 12 솔루션 */}
        <section className="sec dark pad">
          <div className="wrap">
            <Rise className="head">
              <div>
                <span className="eyebrow">Solution</span>
                <span className="label">솔루션<Ja>ソリューション</Ja></span>
              </div>
              <div>
                <h2 className="h2">
                  공원의 밤이 함께 그리는 수면이 됩니다.
                  <Ja big>公園の夜が共に描く水面になります。</Ja>
                </h2>
              </div>
            </Rise>
          </div>
          <Rise delay={0.08} className="mt-l">
            <div className="wrap-wide" style={{ paddingLeft: 'var(--pad)', paddingRight: 'var(--pad)' }}>
              <Compare
                before={M + 'asis.webp'}
                after={M + 'tobe.webp'}
                beforeTag="AS-IS"
                afterTag="TO-BE"
                note={bi ? '가운데를 끌어 비교해 보세요   中央をドラッグして見比べてください' : '가운데를 끌어 비교해 보세요'}
              />
              <div className="grid-2 mt-m">
                <p className="body">
                  산책로를 걷고 휴대폰을 보다 돌아가는 조용한 밤의 연못입니다.
                  <Ja>遊歩道を歩きスマホを見て帰る、静かな夜の池です。</Ja>
                </p>
                <p className="body lime">
                  그리기 칸에서 수면에 그리고 지나던 사람은 휴대폰으로 함께 보는 밤입니다.
                  <Ja>描画エリアで水面に描き、通りがかった人はスマホで一緒に見る夜です。</Ja>
                </p>
              </div>
            </div>
          </Rise>
        </section>

        {/* 13 디자인 키워드 */}
        <section className="sec dark pad pad-b0">
          <div className="wrap">
            <Rise className="head">
              <div>
                <span className="eyebrow">Design Keyword</span>
                <span className="label">디자인 키워드<Ja>デザインキーワード</Ja></span>
              </div>
              <div>
                <h2 className="h2">
                  찍고 흘리고 섞으며 한 장의 그림을 그립니다.
                  <Ja big>落とし、流し、混ぜながら一枚の絵を描きます。</Ja>
                </h2>
                <p className="body mt-m" style={{ maxWidth: '62ch' }}>
                  MINAMO는 일본 墨流し에서 온 그리기 경험입니다. 平安時代 사람들은 수면에 퍼진 먹 무늬를 종이로 떠서 노래를 적었습니다.
                  MINAMO는 도시 물가의 수면을 그 종이로 삼아 XR 펜 두 자루로 누구나 함께 그리게 합니다.
                  <Ja>
                    MINAMOは日本の墨流しから生まれた描画体験です。平安時代の人々は水面に広がる墨の模様を紙に写し、歌を書きました。
                    MINAMOは都市の水辺の水面をその紙とし、XRペン2本で誰もが一緒に描けるようにします。
                  </Ja>
                </p>
              </div>
            </Rise>
          </div>
          <div className="mt-l out">
            <div className="kw">
              <KeywordCell mode="drop" img={M + 'kw_drop.webp'} en="Drop" ko="찍는" ja="落とす"
                desc="펜 끝을 톡 치면 수면에 먹 원이 떨어져 퍼집니다."
                descJa="ペン先をトンと触れると水面に墨の円が落ちて広がります。"
                action={bi ? '눌러 보기   押してみる' : '눌러 보기'} />
              <KeywordCell mode="flow" img={M + 'kw_flow.webp'} en="Flow" ko="흘리는" ja="流す"
                desc="다른 펜으로 휘저으면 무늬가 물결을 타고 흘러갑니다."
                descJa="もう一本のペンでかき混ぜると模様が波に乗って流れます。"
                action={bi ? '끌어 보기   ドラッグする' : '끌어 보기'} />
              <KeywordCell mode="blend" img={M + 'kw_blend.webp'} en="Blend" ko="섞이는" ja="混ざる"
                desc="옆 칸 사람이 그린 무늬와 섞여 한 장의 수면 그림이 됩니다."
                descJa="隣のエリアの人が描いた模様と混ざり、一枚の水面の絵になります。"
                action={bi ? '두 무늬 섞기   二つを混ぜる' : '두 무늬 섞기'} />
            </div>
          </div>
        </section>

        {/* 14 로고와 색 */}
        <section className="sec white pad pad-b0" id="s-brand">
          <div className="wrap">
            <Rise className="head">
              <div>
                <span className="eyebrow">Logo Motif</span>
                <span className="label">로고 모티프<Ja>ロゴモチーフ</Ja></span>
              </div>
              <div className="brand-row">
                <div>
                  <h2 className="h2">
                    MINAMO는 수면을 뜻하는 일본어 みなも에서 왔습니다.
                    <Ja big>MINAMOは水面を意味する日本語「みなも」から名付けました。</Ja>
                  </h2>
                  <p className="body mt-m">
                    墨流し에서 먹이 동심원으로 퍼지고 붓 끝을 따라 흐르는 순간을 모티프로 로고를 디자인했습니다.
                    티타늄 그레이는 장비의 몸체를, 시그널 라임은 펜 끝에서 수면으로 번지는 빛을 나타냅니다.
                    <Ja>
                      墨流しで墨が同心円に広がり、筆先に沿って流れる瞬間をモチーフにロゴをデザインしました。
                      チタングレーは機器の本体を、シグナルライムはペン先から水面へ広がる光を表します。
                    </Ja>
                  </p>
                </div>
                <div className="logo-lock" style={{ justifyContent: 'center' }}>
                  <span className="logo-sym" style={{ borderColor: '#10110E', background: 'radial-gradient(circle, #6BFF71 0 33%, transparent 34%)' }} />
                  <span className="logo-type">MINAMO</span>
                </div>
              </div>
            </Rise>
          </div>
          <Rise delay={0.08} className="mt-l out">
            <Fig src={M + 'logo_swirl.webp'} full ratio="ratio-wide" alt="墨流し 소용돌이 무늬와 연두 선" />
          </Rise>
        </section>

        {/* 15 형태 탐색 */}
        <section className="sec paper pad" id="s-form">
          <div className="wrap">
            <Rise className="head">
              <div>
                <span className="eyebrow">Form Study</span>
                <span className="label">형태 탐색<Ja>形態探索</Ja></span>
              </div>
              <div>
                <h2 className="h2">
                  GPT 이미지와 미드저니로 형태를 넓게 펼쳤습니다.
                  <Ja big>GPT画像とMidjourneyで形を幅広く広げました。</Ja>
                </h2>
                <p className="body mt-m" style={{ maxWidth: '58ch' }}>
                  GPT 이미지로 투과형 XR 바이저와 그리기 펜의 형태를 펼치고, 미드저니로 재질과 빛 반사를 비교했습니다.
                  발밑이 보이는 렌즈와 붓처럼 쥐는 펜을 최종 디자인으로 정했습니다.
                  <Ja>
                    GPT画像で透過型XRバイザーと描画ペンの形を広げ、Midjourneyで素材と光の反射を比べました。
                    足元が見えるレンズと筆のように握るペンを最終デザインに決めました。
                  </Ja>
                </p>
              </div>
            </Rise>
            <Rise delay={0.08} className="mt-l out">
              <div className="bleed-grid bleed-3">
                {[
                  ['form_visor', '맑은 한 장 렌즈와 연두 실리콘 밴드를 골라 투과형 바이저로 발전시켰습니다.', '透明な一枚レンズとライムのシリコンバンドを選び、透過型バイザーへ発展させました。'],
                  ['form_pen', '붓처럼 쥐는 가는 몸통과 연두 그립 밴드를 골라 그리기 펜으로 발전시켰습니다.', '筆のように握る細い本体とライムのグリップバンドを選び、描画ペンへ発展させました。'],
                  ['form_mj', '미드저니로 바이저와 펜의 재질과 빛 반사를 비교해 최종 렌더 방향을 정했습니다.', 'Midjourneyでバイザーとペンの素材と光の反射を比べ、最終レンダーの方向を決めました。'],
                ].map(([img, d, dj]) => (
                  <div className="fig ratio-sq" key={img}>
                    <img src={M + img + '.webp'} alt={d} loading="lazy" />
                    <div className="over-text">
                      <p className="cap over-cap">{d}<Ja>{dj}</Ja></p>
                    </div>
                  </div>
                ))}
              </div>
            </Rise>
          </div>
        </section>

        {/* 16 바이저 컨셉 */}
        <section className="sec dark pad pad-b0">
          <div className="wrap">
            <Rise className="head">
              <div>
                <span className="eyebrow">Concept</span>
                <span className="label">제품 컨셉<Ja>プロダクトコンセプト</Ja></span>
              </div>
              <div>
                <h2 className="h2">
                  수면에 그리는 투과형 XR 바이저
                  <Ja big>水面に描く透過型XRバイザー</Ja>
                </h2>
                <p className="body mt-m" style={{ maxWidth: '58ch' }}>
                  한 장으로 감싼 투과형 렌즈로 발밑과 난간이 그대로 보이는 시야를 줍니다.
                  그리기 칸을 벗어나면 그리기가 멈추고 손을 뻗는 동작만 읽어 안전하게 쓸 수 있습니다.
                  <Ja>
                    一枚で包む透過型レンズで、足元と手すりがそのまま見える視界を届けます。
                    描画エリアを出ると描画が止まり、手を伸ばす動作だけを読むので安全に使えます。
                  </Ja>
                </p>
              </div>
            </Rise>
          </div>
          <Rise delay={0.08} className="mt-l out">
            <Fig src={M + 'visor_portrait.webp'} full ratio="ratio-wide" alt="바이저를 쓴 인물 렌더" position="50% 30%" />
          </Rise>
        </section>

        {/* 17 펜 컨셉 */}
        <section className="sec paper pad" id="s-pen">
          <div className="wrap">
            <Rise className="head">
              <div>
                <span className="eyebrow">Concept</span>
                <span className="label">제품 컨셉<Ja>プロダクトコンセプト</Ja></span>
              </div>
              <div>
                <h2 className="h2">
                  墨流し의 붓 두 자루를 재해석한 수면 그리기 펜
                  <Ja big>墨流しの筆2本を再解釈した水面描画ペン</Ja>
                </h2>
                <p className="body mt-m" style={{ maxWidth: '58ch' }}>
                  한 자루로 먹을 찍고 다른 한 자루로 퍼뜨리는 두 자루 구성으로 墨流し의 동작을 그대로 옮겼습니다.
                  붓처럼 쥐는 가는 티타늄 몸통과 연두 그립 밴드로 바이저와 같은 CMF를 입혀 한 제품군으로 묶었습니다.
                  <Ja>
                    一本で墨を落とし、もう一本で広げる2本構成で墨流しの動作をそのまま再現しました。
                    筆のように握る細いチタンの本体とライムのグリップバンドで、バイザーと同じCMFをまとい一つの製品群にまとめました。
                  </Ja>
                </p>
              </div>
            </Rise>
          </div>
          <Rise delay={0.08} className="mt-l out">
            <div className="bleed-grid bleed-2">
              <div className="fig ratio-32"><img src={M + 'pen_hero.webp'} alt="펜을 쥔 손 렌더" loading="lazy" /></div>
              <div className="fig ratio-32"><img src={M + 'pens_x.webp'} alt="펜 두 자루 렌더" loading="lazy" /></div>
            </div>
          </Rise>
        </section>

        {/* 18 장면 */}
        <section className="sec dark">
          <SceneDraw src={M + 'scene_lotus.webp'} alt="밤 수면 위에 연두 연꽃을 그리는 장면">
            <div className="scene-cap">
              <span className="eyebrow">Scene</span>
              <p className="h2">
                손을 뻗으면 수면에 선이 남습니다.
                <Ja big>手を伸ばすと水面に線が残ります。</Ja>
              </p>
            </div>
          </SceneDraw>
        </section>

        {/* 19 함께 그리는 밤 */}
        <section className="sec dark pad">
          <div className="wrap">
            <Rise className="head">
              <div>
                <span className="eyebrow">Scene</span>
                <span className="label">함께 그리는 밤<Ja>共に描く夜</Ja></span>
              </div>
              <div>
                <h2 className="h2">
                  옆 칸 사람과 무늬가 만나면 두 사람의 그림이 한 장의 수면이 됩니다.
                  <Ja big>隣のエリアの人と模様が出会うと、二人の絵が一枚の水面になります。</Ja>
                </h2>
              </div>
            </Rise>
          </div>
          <Rise delay={0.08} className="mt-l out">
            <Fig src={M + 'scene_together.webp'} full ratio="ratio-wide" alt="다리 위 두 사람이 수면에 기러기를 그리는 밤" />
          </Rise>
        </section>

        {/* 20 여러 장면 */}
        <section className="sec dark pad pad-b0">
          <div className="wrap">
            <Rise className="head">
              <div>
                <span className="eyebrow">Moments</span>
                <span className="label">여러 장면<Ja>さまざまな場面</Ja></span>
              </div>
              <div>
                <h2 className="h2">
                  혼자 시작한 그림이 옆 칸과 지나는 사람에게로 번집니다.
                  <Ja big>一人で始めた絵が隣のエリアと通りがかりの人へ広がります。</Ja>
                </h2>
                <p className="body mt-m" style={{ maxWidth: '58ch' }}>
                  보름 밤마다 같은 수면에 다시 모입니다.
                  <Ja>満月の夜ごとに同じ水面へまた集まります。</Ja>
                </p>
              </div>
            </Rise>
          </div>
          <Rise delay={0.06} className="mt-l out">
            <Fig src={M + 'm_group.webp'} full ratio="ratio-wide" alt="여럿이 난간에 서서 함께 그리는 밤 수면" />
          </Rise>
          <div className="mt-m out" style={{ paddingBottom: 'var(--sec)' }}>
            <Marquee items={[
              { src: M + 'm_overhead.webp', alt: '위에서 본 수면' },
              { src: M + 'm_viewers.webp', alt: '휴대폰으로 보는 사람들' },
              { src: M + 'm_closeup.webp', alt: '손끝의 먹 원' },
            ]} />
            <p className="cap" style={{ padding: '12px var(--pad) 0' }}>
              {bi ? '위에서 본 수면  上から見た水面 / 휴대폰으로 보기  スマホで見る / 손끝의 먹 원  指先の墨の円'
                : '위에서 본 수면 / 휴대폰으로 보기 / 손끝의 먹 원'}
            </p>
          </div>
        </section>

        {/* 21 휴대폰 관람 */}
        <section className="sec white pad" id="s-mobile">
          <div className="wrap">
            <Rise className="head">
              <div>
                <span className="eyebrow">UIUX</span>
                <span className="label">휴대폰 관람<Ja>スマホで鑑賞</Ja></span>
              </div>
              <div>
                <h2 className="h2">
                  QR 한 번으로 웹 XR이 열립니다.
                  <Ja big>QR一回でWeb XRが開きます。</Ja>
                </h2>
                <p className="body mt-m" style={{ maxWidth: '58ch' }}>
                  앱 설치 없이 물가 쪽으로 휴대폰을 들면 수면 위 그림과 그린 사람이 보입니다.
                  마음에 든 작가를 팔로우하면 다음 보름 밤 라이브 알림을 받습니다.
                  <Ja>
                    アプリ不要で、水辺にスマホをかざすと水面の絵と描いた人が見えます。
                    気に入った作り手をフォローすると、次の満月の夜のライブ通知が届きます。
                  </Ja>
                </p>
              </div>
            </Rise>
          </div>
          <div className="wrap"><PhoneDemo
            shots={[
              { src: M + 'ph_info.webp', alt: '수면 정보 화면' },
              { src: M + 'ph_view.webp', alt: '수면 보기 화면' },
              { src: M + 'ph_card.webp', alt: '작가 카드 화면' },
            ]}
            steps={[
              { n: bi ? '수면 정보  水面情報' : '수면 정보', t: bi ? '지금 수면에 떠 있는 그림 수와 남은 그리기 칸을 봅니다   いま水面に浮かぶ絵の数と残りの描画エリアを見ます' : '지금 수면에 떠 있는 그림 수와 남은 그리기 칸을 봅니다' },
              { n: bi ? '수면 보기  水面を見る' : '수면 보기', t: bi ? '물가로 휴대폰을 들면 그림과 그린 사람이 함께 보입니다   水辺にスマホをかざすと絵と描いた人が一緒に見えます' : '물가로 휴대폰을 들면 그림과 그린 사람이 함께 보입니다' },
              { n: bi ? '작가 카드  作り手カード' : '작가 카드', t: bi ? '팔로우하면 다음 보름 밤 라이브 알림을 받습니다   フォローすると次の満月の夜のライブ通知が届きます' : '팔로우하면 다음 보름 밤 라이브 알림을 받습니다' },
            ]}
          /></div>
        </section>

        {/* 22 마무리 */}
        <section className="sec dark">
          <div className="end">
            <Fig src={M + 'pens_x.webp'} full ratio="ratio-sq" alt="펜 두 자루" />
            <Fig src={M + 'visor_portrait.webp'} full ratio="ratio-sq" alt="바이저를 쓴 인물" />
          </div>
          <div className="pad">
            <div className="wrap">
              <Rise>
                <h2 className="h2">
                  수면에 번지는 밤의 그림
                  <Ja big>水面に広がる夜の絵</Ja>
                </h2>
                <div className="rule mt-l" />
                <dl className="credit mt-m">
                  <dt>작품</dt>
                  <dd>XR Drawing Glass : MINAMO</dd>
                  <dt>과정</dt>
                  <dd>2026 한림대학교 캡스톤디자인</dd>
                  <dt>전시</dt>
                  <dd>제19회 디지털인문예술전공 프로젝트 전시회, 2026. 12. 1.~12. 3.</dd>
                  <dt>자료 출처</dt>
                  <dd>
                    후쿠오카시 기본계획 참고 데이터집과 시정 앙케트, 일본 내각관방 이동 의식조사, 日本財団 18歳意識調査,
                    上野正也 외 都市計画論文集 60巻1号, Scopely 행사 보고, Bhattacharya 외 CHI 2019
                  </dd>
                  <dt>사진</dt>
                  <dd>
                    Wikimedia Commons: 36poets collection MITSUNE1L, Hirho, hyolee2, そらみみ, Joli Rumi,
                    Ludovic Lubeigt, kkairri, t.ashihara, Jim Trottier
                  </dd>
                </dl>
              </Rise>
            </div>
          </div>
        </section>
      </main>
    </LangCtx.Provider>
  );
}
