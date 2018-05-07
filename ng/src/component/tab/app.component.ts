import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
	selector: 'i-tab',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class TabComponent {
	path=null
	constructor(private router: Router){};
  ngOnInit(){
  	this.path=this.router.url
  };
}
