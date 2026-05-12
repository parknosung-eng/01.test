# NotebookLM 유튜브 요약 보고서 만들기 — 로컬 실행 가이드

대상 영상: <https://youtu.be/Suinr8kkaKI>

이 문서는 [`notebooklm-mcp-cli`](https://github.com/jacob-bd/notebooklm-mcp-cli)
를 사용해 위 영상을 NotebookLM에 소스로 추가하고, AI 요약을 받아
마크다운 보고서로 저장하는 전체 절차를 정리합니다.

> 이 작업은 본인의 Google 계정으로 NotebookLM에 로그인해야 하므로
> **사용자 본인의 로컬 머신**에서 실행해야 합니다.
> 샌드박스/CI에서는 브라우저가 없거나 외부 호스트가 차단되어 동작하지 않습니다.

---

## 0. 사전 준비

- NotebookLM 접속 가능한 Google 계정
- Python 3.10+
- 데스크톱 브라우저(Chrome / Edge / Brave / Arc / Chromium 중 하나)

## 1. 설치

`uv`를 권장합니다.

```bash
# uv 미설치 시
curl -LsSf https://astral.sh/uv/install.sh | sh

# CLI + MCP 서버 설치 (이 한 줄로 둘 다 설치됨)
uv tool install notebooklm-mcp-cli

# 동작 확인
nlm --help
```

대안:

```bash
pipx install notebooklm-mcp-cli
# 또는
pip install --user notebooklm-mcp-cli
```

## 2. 로그인 (쿠키 추출)

```bash
nlm login
```

브라우저가 자동으로 열리고 Google 로그인 → NotebookLM 이동 후
쿠키가 추출되어 로컬에 저장됩니다(2~4주간 유지, 자동 갱신).

문제가 생기면 진단:

```bash
nlm login --check
nlm doctor
```

여러 계정을 쓴다면 프로필 사용:

```bash
nlm login --profile work
nlm login switch work
```

## 3. 노트북 생성

```bash
nlm notebook create "YouTube Summary - Suinr8kkaKI"
nlm notebook list   # 생성된 노트북 이름/ID 확인
```

## 4. 유튜브 영상 소스 추가

```bash
nlm source add "YouTube Summary - Suinr8kkaKI" \
    --youtube "https://youtu.be/Suinr8kkaKI"
```

NotebookLM이 자동으로 자막을 가져와 인덱싱할 때까지 30초~몇 분
기다립니다. 인덱싱 완료 여부는 `nlm notebook query`가 의미 있는
응답을 내는지로 확인됩니다.

## 5. 요약 받기

원하는 만큼 자유롭게 질의할 수 있지만, 보고서 형태로 받으려면
구조화된 프롬프트가 좋습니다.

```bash
NOTEBOOK="YouTube Summary - Suinr8kkaKI"

nlm notebook query "$NOTEBOOK" "다음 형식의 한국어 마크다운 보고서를 작성해줘:

# 제목
- 영상 제목과 채널명

## 한 줄 요약
- 3~4문장으로 핵심을 요약

## 핵심 포인트
- 영상의 주요 주장/사실을 글머리표 5~8개로

## 타임라인 하이라이트
- 시간 구간별 핵심 내용

## 인용할 만한 발언
- 원문 그대로 1~3개

## 시사점 / 액션 아이템
- 시청자가 가져갈 수 있는 인사이트

## 한계와 미확인 사항
- 영상이 다루지 않은 부분, 검증이 필요한 주장
" > summary.md
```

여러 각도로 질의해 합치고 싶다면:

```bash
nlm notebook query "$NOTEBOOK" "영상의 핵심 주장을 한 줄로 요약" >> summary.md
nlm notebook query "$NOTEBOOK" "반론이나 한계는 무엇인가" >> summary.md
```

## 6. (선택) Studio 아티팩트로 만들고 마크다운 다운로드

NotebookLM Studio에서 "Briefing Doc" 같은 마크다운형 산출물을
생성한 뒤 내려받을 수 있습니다. 산출물 ID는 `studio create`
출력이나 NotebookLM 웹 UI에서 확인합니다.

```bash
# 슬라이드/오디오/비디오 등 산출물 생성
nlm studio create "$NOTEBOOK" --type slides --confirm

# 마크다운으로 내려받기
nlm download markdown "$NOTEBOOK" <artifact-id> -o report.md
```

## 7. 이 레포에 저장하기

생성된 `summary.md`(또는 `report.md`)를 이 레포 `docs/`에 옮기고
커밋합니다.

```bash
mv summary.md docs/youtube-Suinr8kkaKI-summary.md
git add docs/youtube-Suinr8kkaKI-summary.md
git commit -m "docs: add NotebookLM summary for youtube Suinr8kkaKI"
git push
```

---

## 자주 발생하는 문제

| 증상 | 해결 |
|---|---|
| `nlm login`이 브라우저를 못 연다 | `--browser chrome` 등 명시, 또는 `--manual --file cookies.txt`로 수동 임포트 |
| 쿼리가 "source still processing" 응답 | 영상이 길면 인덱싱에 수 분 소요. 잠시 후 재시도 |
| 자막이 없는 영상 | NotebookLM은 자동자막에 의존. 자막이 없으면 결과 품질이 떨어짐 |
| 답변 짧음 | 프롬프트에 "마크다운 형식으로 600단어 이상" 등 길이 지시 추가 |
| 토큰 만료 | `nlm login --check` 후 필요시 `nlm login` 재실행 |

## 참고

- 공식 저장소: <https://github.com/jacob-bd/notebooklm-mcp-cli>
- NotebookLM: <https://notebooklm.google.com>
