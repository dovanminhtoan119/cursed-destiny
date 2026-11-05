#!/bin/sh
# Tạo index.html (GitHub Pages) từ app.part.html
{ printf '<!doctype html>\n<html lang="vi">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n</head>\n<body>\n'; cat app.part.html; printf '</body>\n</html>\n'; } > index.html
