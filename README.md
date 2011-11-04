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

### Templates.js

If you work with javascript long enough, sooner or later you will need to generate some HTML from your code. If you want something fast, tested and robust, look for something else. This micro-library is very simple (about 20 loc), extremely small and a surprisingly powerful. Can be handy for some quick hacks, as a base for your own template engine or if you are trying to reduce the size of your page.

The idea behind `Templates.js` comes from John Resig's micro-template engine. I just can't understand his implementation (Johnny is way beyond my league), so I did it my way.

Using the library is very, very easy: `var the_compiled_template = Wrlx.Template("the template string");`. And then just call `the_compiled_tempalte` with the locals in a literal object. Writing the templates as javascript's strings is really akward, so I recommend you to write it inside a `<script type="text/template">` tag and use `Wrlx.Template.by_id('script-tag-id')`. A more detailed example:

First, add something like this to the HTML of the page (you can put it wherever you prefer):

```html

<script type="text/template" id="table-template">
  <table>
    <tr>
      <th> English </th>
      <th> Spanish </th>
    </tr>
    <% for (var thing in list) { %>
      <tr>
        <td> <%= thing       %>  </td> 
        <td> <%= list[thing] %>  </td> 
      </tr>
    <% } %>
  </table>
</script>

```

And then you can do something like the following:

```javascript

var T = { 
  // literal string... too ugly!
  list: Wrlx.Template(
    '<ul> \
      <% for (var i=0,_len=items.length; i<_len; i++) { %> \
        <li> <%= items[i] %> </li> \
      <% } %> \
    </ul>'),
  // inside a script tag
  table: Wrlx.Template.by_id('table-template')
};

window.onload = function() {
  test_output = document.getElementById('output');
  test_output.innerHTML = T['list']({items: [1,2,3,4,5]});
  test_output.innerHTML += T['table']({list: {one: "uno", two: "dos", three: "tres"}});
}

```


