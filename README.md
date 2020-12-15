PHÁT TRIỂN ỨNG DỤNG MÔ PHỎNG NỀN WEB DỰA TRÊN TÁC TỬ SỬ DỤNG NỀN TẢNG GAMA

-------------------------------------Hướng dẫn cài đặt------------------------------------------------
+ Checkout https://github.com/HaVu279/GamaNew.git ở branch gama và để chúng cùng 1 folder GamaNew
+ GAMA platform
	https://gama-platform.github.io/wiki/Installation: cài đặt trong cùng folder GamaNew
+ Sửa thông tin đường dẫn trong file gama-headless.sh cho đúng.
  - java -cp ../GAMA_1.8.1_Linux_with_JDK/plugins/org.eclipse.equinox.launcher*.jar -Xms512m -Xmx$memory  -Djava.awt.headless=true org.eclipse.core.launcher.Main  -application msi.gama.headless.id4 -data $passWork $PARAM $mfull $outputFile
+ Database:
  - Cài postgresql và pgAdmin4 (có thế install bằng terminal)
  - Tạo 1 database: gama_project
+ Tạo một tài khoản trên https://s3.console.aws.amazon.com/
  - Thay đổi thông tin s3 trong file SimulationController
+ Backend:
	Run project(use IDE VD: eclipse)
+ FrontEnd
	* Cài đặt: Node.js: https://nodejs.org/en/download/ hoặc sudo apt install nodejs
			   npm: sudo apt install npm
	* Open terminal:
		- Run: npm install
		- Run: npm start

+ Open localhost:4200/login

-------------------------------------------- Chức năng-----------------------------------------------
+ Sign up: Đăng ký user
+ Sign in: Đăng nhập bằng tài khoản user
+ Add/Edit/Delete project: Thêm mới, chỉnh sửa, xóa project
+ Mô phỏng
  - Import file model
  - Chỉnh sửa file model
  - Thay đổi final step
  - Run simulation
