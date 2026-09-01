FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# 식당 데이터를 저장할 디렉토리 (Coolify에서 볼륨으로 연결 권장)
RUN mkdir -p /data
VOLUME ["/data"]

ENV PORT=5000
EXPOSE 5000

CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]
