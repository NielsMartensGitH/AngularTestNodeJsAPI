import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'toolsets';
  imageToShow: any;
  isImageLoading: boolean = false;

  constructor(private httpClient: HttpClient) {}

  // VOOR UPLOADEN MEERDERE FILES

  uploadMultiple(event: any) {
    const files: FileList = event.target.files;

    const formdata = new FormData();

    for (let index = 0; index < files.length; index++) {
      const element = files[index];
      formdata.append('files', element);
    }

    this.httpClient
      .post('http://localhost:4000/multiplefiles', formdata)
      .subscribe(
        (d) => {
          console.log(d);
        },
        (error) => {
          console.error(error);
        }
      );
  }

    // VOOR UPLOADEN 1 FILE

  upload(event: any) {
    const file = event.target.files[0];

    const formdata = new FormData();
    formdata.append('file', file);

    this.httpClient.post('http://localhost:4000/file', formdata).subscribe(
      (d) => {
        console.log(d);
      },
      (error) => {
        console.error(error);
      }
    );
  }


// FETCH IMAGES PATH FROM DATABASE

  getFileName() {
    this.httpClient.get("http://gameofcones.be/api/images/100").subscribe(data => {
      this.getImage(data[0].imagepath);
    })
  }


  // FETCH IMAGE BLOB FROM NODEJS API

  getImage(imgPath: string) { 
    this.isImageLoading = true;
    this.httpClient.get('http://localhost:4000/upload/' + imgPath, { responseType: 'blob' }).subscribe(
      image => {
        this.createImageFromBlob(image);
        this.isImageLoading = false;
      },error => {
        this.isImageLoading = false;
        console.log(error);
      });
  }

  // CONVERT BLOB BACK TO IMAGE

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
       this.imageToShow = reader.result;
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
 }

}
