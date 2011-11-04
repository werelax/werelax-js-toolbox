# WeRelax's JavaScript ToolBox

This is a personal repository for my own convenience. Some place to store some micro-libraries with useful utilities that I have been collecting. Some of them are shameless rip-offs of fragments from other libraries and the rest are mostly reimplementations or a simplified version of someone else's ideas. I have some 100% original material here, but not much and not very good.

### Modules.js

This one is almost a copy-paste from the Module implementation from Spine.js, with a couple of little tweaks. It can be used as a inheritance library, like this:

```javascript

var BaseClass = Wrlx.Class.create({
    // init is the constructor
    init: function() {
        console.log("BaseClass!");
    },
    somevalue: "I am a property",
    somemethod: function (v) {
        console.log("BaseClass#somemethod!<br>");
        console.log("somevalue: " + this.somevalue);
    }
});

var ChildClass = BaseClass.create({
    init: function() {
        console.log("ChildClass!");
        // Call the superclass constructor
        this.super('init');
    },
    somemethod: function (v) {
        console.log("ChildClass#somemethod!<br>");
        // Call superclass#somemethod
        this.super('somemethod');
    }
});


var a = new BaseClass;
a.somemethod();

var b = new ChildClass;
b.somemethod();

```

But also can be used to build a simple module system. The meaning and the syntax of `Wrlx.Class.include` `Wrlx.Class.extend` are identical to the Spine.js equivalents. A quick example of this:

```javascript

var StaticModule = {
  say_hi: function() { console.log("I say: Hi there!"); },
  extended: function() {
    console.log("StaticModule has been used to extend a class");
  }
};
var InstanceModule = {
  module_property: "I am from SomeModule",
  included: function() {
    console.log("InstanceModule has been included in the instances");
  }
};

var MyClass = Wrlx.Class.create({
  init: function() { console.log(this.module_property); }
});

// include

MyClass.include(InstanceModule);
var t = new MyClass();

// extend

MyClass.extend(StaticModule);
MyClass.say_hi();

```
