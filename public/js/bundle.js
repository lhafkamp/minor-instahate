(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
console.log('ping');
require('./io');
console.log('pong');

},{"./io":2}],2:[function(require,module,exports){
const socket = io()
const addNewPic = document.querySelector('.pics')

socket.on('newPic', data => {
	const newPics = data.image
	addNewPic.insertAdjacentHTML('beforeend', 
	`
		<div class="pic">
			<div>
				<img src="${newPics}"/>
				<p>100</p>
			</div>
			<div>
				<button>bad</button>
				<button>good</button>
			</div>
		</div>
	`)
})
},{}]},{},[1]);
