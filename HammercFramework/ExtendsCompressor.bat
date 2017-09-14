@echo off

cd src\hammerc\extends
java -jar D:\project\tool\yuicompressor-2.4.8.jar --type js -o ".js$:.min.js" *.js

pause