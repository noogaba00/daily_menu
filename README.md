# 오늘의 메뉴 뽑기

식당 목록을 등록해두고, 버튼 하나로 오늘 점심 메뉴를 랜덤으로 뽑아주는 웹앱입니다.

- 🎲 랜덤 메뉴 뽑기
- ➕ 식당 추가 (이름 + 분류)
- 🗑️ 식당 삭제
- 데이터는 SQLite(`/data/menu.db`)에 저장

## 로컬 실행

```bash
pip install -r requirements.txt
python app.py
```

`http://localhost:5000` 접속

## Docker로 실행

```bash
docker build -t menu-picker .
docker run -p 5000:5000 -v menu_data:/data menu-picker
```

## Coolify 배포 (Public Git Repository)

1. 이 폴더 전체를 GitHub 저장소로 push
2. Coolify → New Resource → Applications → **Public Git Repository**
3. Repository URL 입력, Branch: `main`
4. Build Pack: **Dockerfile** 자동 감지 (Dockerfile이 루트에 있어야 함)
5. **Storages** 탭에서 `/data` 경로에 Persistent Volume 추가
   - 추가하지 않으면 재배포 시 등록한 식당 목록이 초기화됩니다.
6. Port: `5000`
7. Deploy 클릭

## 폴더 구조

```
menu-picker/
├── app.py
├── requirements.txt
├── Dockerfile
├── .gitignore
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js
```
