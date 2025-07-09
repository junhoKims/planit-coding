# 📝 플랜잇스퀘어 과제

## 🎯 프로젝트 개요

바닐라 자바스크립트를 사용하여 구현한 Todo List

## 🚀 실행 방법

vscode `live-server` 사용

## 🏗️ 프로젝트 구조

```
planit-coding/
├── index.html              # 메인 HTML 파일
├── index.js                # 앱 진입점
├── App.js                  # 메인 애플리케이션 컴포넌트
├── style.css               # 스타일시트
├── utils.js                # 유틸함수
├── components/             # 컴포넌트 폴더
│   ├── TodoList.js         # 할 일 목록 컴포넌트
│   ├── TodoInput.js        # 할 일 입력/수정 컴포넌트
│   └── TodoCounter.js      # 완료 상태 표시 컴포넌트
├── model/                  # 데이터 모델
│   └── model.js            # 기본 데이터
└── README.md               # 문서
```

## ⚙️ 설계

- App.js 내부에서 랩핑할 Root 요소(todo-counter, todo-list 등)를 생성 및 초기화
- 체크박스를 선택 시, 체크한 input이 수정 기능으로 전환되며, 선택한 todo의 텍스트를 변경할 수 있습니다.
- 페이지를 떠나려 할 시, 메모리누수를 막고자 클린업 함수가 수행합니다.

### 데이터 흐름

- App.js에서 todo를 관리하는 배열인 `data`와 수정을 위해 선택한 todo를 가리키는 `selected` 상태를 관리합니다.
- 모든 데이터는 App.js에서 컴포넌트로 콜백 기반, 단방향 진행되도록 설계 및 구현하였습니다.
- 컴포넌트에 이벤트를 통해 App.js에서 로직이 동작하도록 설계 및 구현하였습니다.
