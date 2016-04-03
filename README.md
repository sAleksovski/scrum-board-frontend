# Scrum Board

Scrum board is a web application consisting of two parts:

 - [Spring Boot backend](https://github.com/sAleksovski/scrum-board)
 - AngularJS powered HTML5 frontend (this)

You can login with Facebook, Twitter and Google+.

You can create different scrum boards, and each board can have multiple sprints. Each sprint can have many tasks, and they can be in different state (*Todo, In Progress, Testing, Blocked or Done*). You can assign difficulty to tasks, priority and comment on them.

### Tech

The frontend uses a number of open source projects to work properly:

* [AngularJS](https://angularjs.org/)
* [Angular Material](https://material.angularjs.org/)
* [angular-drag-and-drop-lists](https://github.com/marceljuenemann/angular-drag-and-drop-lists)
* [npm](https://www.npmjs.com/)
* [bower](http://bower.io/)
* [Gulp](http://gulpjs.com/)

### Screenshots

![Board](http://i.imgur.com/YDHgWM5.png)
![Single task description](http://i.imgur.com/Y4xM3YJ.png)

### Running

You need npm, Bower and Gulp installed globally:

```sh
$ npm install -g bower gulp
```

```sh
$ git clone https://github.com/sAleksovski/scrum-board-frontend.git scrum-board-frontend
$ cd scrum-board-frontend
$ npm install
$ bower install
$ gulp
```
