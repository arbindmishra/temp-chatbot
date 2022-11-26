import { AllDataService } from './../all-data.service';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css'],
})
export class ChatboxComponent {
  public askData: string[] = []; //ARRAY THAT HOLDS THE KEYWORD OF QUESTIONS TO BE ASKED TO USER
  public userDataJson: any = {}; //THE USER DATA ASSIGNED TO THE KEYWORD AS AN OBJECT
  regexArr: any[] = [
    /^([a-zA-Z \-\'])+[a-zA-Z]?$/, //firstName
    /^([a-zA-Z \-\'])+[a-zA-Z]?$/, //lastName
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, //email
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/, //PhoneNo.
    /^([a-zA-Z \-\'])+[a-zA-Z]?$/, //communicationmedium
    /^[ A-Za-z0-9_@./#&+-]*$/, //address(tochecktheregex)
    /^[a-zA-Z -]+([a-zA-Z. ]+)?$/, //city
    /^[a-zA-Z]+([a-zA-Z ]+)?$/, //state
    /(^\d{5}$)|(^\d{5}-\d{4}$)/, //zipcode
    /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/, //dob
    /^(?:m|M|male|Male|f|F|female|Female|Other|other)$/, //gender
    /^(\d{3}-?\d{2}-?\d{4}|XXX-XX-XXXX)$/, //socialSecurityNo.
  ];

  totalCount = 0; //THE COUNT OF TOTAL MESSAGES LOGGED BY USER

  constructor(
    private AllDataService: AllDataService,
    private http: HttpClient
  ) {
    //INJECTS THE SERVICE HERE
  }
  ngOnInit() {
    this.askData = this.AllDataService.askData(); //THE DATA IN SERVICE IS ASSIGNED TO COMPONENT LEVEL VARIABLES
    this.userDataJson = this.AllDataService.userJSON();
  }
  urlBot = '/src/assets/images/icoverlogo.png';
  urlUser = '/src/assets/images/avatar.png';
  @ViewChild('box')
  box!: ElementRef; //to access input dom element

  @ViewChild('messages')
  messages!: ElementRef; //to access input dom element

  userMsg = ''; //stores input value from the textbox
  botMsg = ''; //stores bot message
  count = 0; //count gets started when the main user data is collected
  boolReady = false; // once user types ready, this variables gets assigned with true
  readyCount = 0; //this count gets assigned with the value count. this count value is when ready is typed.
  errorMsg = false;
  ready = false;

  typeEnter(e: any, val: any) {
    //enter event-sends message and clears textbox
    if (e.code == 'Enter') {
      if (val != '') {
        this.totalCount++;
        this.userMsg = val;
        if (this.userMsg == 'ready') {
          this.readyCount = this.totalCount;
          this.boolReady = true;
          this.box.nativeElement.value = '';
          this.ready = true;
        } else if (this.regexArr[this.totalCount - 2].test(val) && this.ready) {
          this.allUserData.push(val); // every user data is logged to this array
          this.box.nativeElement.value = ''; //the value inside the textbox gets cleared
        } else {
          this.totalCount--;
          this.box.nativeElement.value = '';
          this.errorMsg = true;
        }
      }
    }
  }

  sendClick(e: any, val: string) {
    //click event- sends message and clears textbox
    if (this.box.nativeElement.value != '') {
      if (e.isTrusted == true) {
        this.totalCount++;
        this.userMsg = val;
        this.box.nativeElement.value = '';
        // this.output(val)
        this.allUserData.push(val);
      }
    }
  }

  log() {
    //this function logs the user and bot messages inside the chatbox
    const singleBox = this.messages.nativeElement;

    if (this.userMsg.length != 0) {
      let userDiv = document.createElement('div');
      userDiv.className = 'userText';
      userDiv.innerHTML = `<span style="line-height: 1.5em;display: inline-block;background: #f38c38;padding: 10px;border-radius: 8px;border-bottom-right-radius: 2px;min-width:30%;max-width: 80%;margin-right: 10px; margin-top:3px; margin-bottom-3px;animation: floatup .5s forwards;">${this.userMsg}</span>`; //<img src="${this.urlUser}" style="height: 25px;" class="avatar">
      userDiv.style.marginLeft = 'auto';
      singleBox.appendChild(userDiv);

      // line-height: 1.5em;display: inline-block;background: #f38c38;padding: 10px;border-radius: 8px;border-bottom-right-radius: 2px;max-width: 80%;margin-right: 10px;animation: floatup .5s forwards;
      // line-height: 1.5em;
      // display: inline-block;
      // background: #f38c38;
      // padding: 10px;
      // border-radius: 8px;
      // border-bottom-right-radius: 2px;
      // max-width: 80%;
      // margin-right: 10px;
      // animation: floatup .5s forwards

      let botDiv = document.createElement('div');
      botDiv.innerText = `typing...`;
      botDiv.innerHTML = `<span>Typing...</span>`; //creates a fake typing message <img src="${this.urlBot}" >
      botDiv.id = 'bot';
      botDiv.className = 'botText';
      singleBox.appendChild(botDiv);

      singleBox.scrollIntoView(false); //the most recent message is shown in the textbox area

      setTimeout(() => {
        botDiv.innerHTML = `<span style="height: 25px;" class="avatar"><span style="line-height: 1.5em;display: inline-block;background:#e0e0e0;padding: 10px;border-radius: 8px;border-bottom-right-radius: 2px;min-width:30%;margin-right: 10px;margin-top:3px; margin-bottom-3px;max-width: 80%;animation: floatup .5s forwards;">${this.message()}</span>`; //<img src="${this.urlBot}" style="height: 25px;" class="avatar">
      }, 500); //after 0.5 sec, the bot message gets logged
    }
  }

  message() {
    if (this.count <= this.askData.length) {
      if (this.boolReady && this.count != this.askData.length) {
        //just after typing ready in accordance array in service, the question is asked by the bot
        if (this.errorMsg) {
          this.botMsg = 'Invalid Input, Please Re-enter the data';
          this.errorMsg = false;
        } else {
          this.botMsg = 'Please type your ' + this.askData[this.count];
          this.count++;
        }
      } else if (this.count == this.askData.length) {
        this.botMsg = 'Thanks for giving your data!'; // thanking after typing all data
        this.count++;
        console.log(this.getUserData()); //and console logs the data collected
        this.onCreateUser(this.getUserData());
      } else {
        this.botMsg =
          this.alternative[Math.floor(Math.random() * this.alternative.length)]; //alternate bot message chosen randomly from alternate array
      }
    } else {
      this.botMsg =
        this.alternative[Math.floor(Math.random() * this.alternative.length)];
    }
    return this.botMsg;
  }
  getUserData() {
    //values gets added in the userData array
    if (this.readyCount != 0) {
      this.userData = this.allUserData.slice(
        this.readyCount - 1,
        this.readyCount + this.askData.length
      ); //slices the specific/main data like name,mobNo,address which was typed by user after typing ready
      for (let i = 0; i < this.userData.length; i++) {
        this.userDataJson[this.askData[i]] = this.userData[i]; //value gets added to the object of this component which is called from service
      }
    }
    return this.userDataJson;
  }

  onCreateUser(creationData: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: number;
    communicationMedium: string;
    address: string;
    city: string;
    state: string;
    zipcode: number;
    dob: Date; // mm-dd-yyyy
    gender: string;
    socialSecurityNumber: number;
  }) {
    this.http
      .post('http://localhost:5000/users/add', creationData)
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  alternative = [
    'Sorry I dont understand',
    'come again',
    'go on',
    'im listening',
  ];
  allUserData: string[] = []; //everything that the user types gets stored
  userData: string[] = []; //the main data of user is stored
}
