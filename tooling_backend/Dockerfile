FROM python:3.9-alpine

WORKDIR /app

COPY src .
COPY poetry.lock .
COPY pyproject.toml .

RUN apk update && apk add python3-dev gcc g++ libc-dev libffi-dev gmp-dev 
RUN python3 -m pip install poetry
RUN python3 -m pip install pycryptodome
RUN poetry config virtualenvs.create false
RUN poetry install --no-dev

ENTRYPOINT [ "indexer" ]