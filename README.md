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

Using the library is very, very easy: `var the_compiled_template = Wrlx.Template("the template string");`. And then just call `the_compiled_template` with the locals in a literal object. Writing the templates as javascript's strings is really akward, so I recommend you to write it inside a `<script type="text/template">` tag and use `Wrlx.Template.by_id('script-tag-id')`. A more detailed example:

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

### StateMachine.js

UI interactions can become pretty complex (they usually do), and the simple and nice js logic that you write for the alpha version of the app quickly grows into a wild spaguetti monster full of intrincate conditional hiding or showing of elements, binding and unbinding of events when the user opens these or that panel, disabling the checkboxes if the form is empty, etc, ... A nightmare. One fine solution for some of these chaotic UIs is aproaching to them as finite state machines, to divide the messy jungle of callbacks into isolated, well defined states and explicit transitions.

My implementation of the finite state machine abstraction is quite opinionated. I've seen some people writing state machines based on events and the PubSub pattern. I don't like it. I don't see the need for something as anarchic as that. I've tried to keep it simple and organized and make the state transitions explicit.

One point I don't really like about this library: there is no clear way for one state to behave different depending of the origin of the transition. I mean: If the SM goes to the state A, it will call A.activate(), and it doesn't care if the transition was B->A or C->A. I'm still not sure if this is important, or how to do it cleanly.

Anyway, let's see an (admitely too long) example of `StateMachine.js`:

First, in the HTML:

```html
<div id="state-1">
  <h2> State 1 </h2>
  <a href="#" class="button"> Go To State2 </a>
</div>

<div id="state-2" style="display:none">
  <h2> State 2 </h2>
  <a href="#" class="button"> Go To State3 </a>
</div>

<div id="state-3" style="display:none">
  <h2> State 3 </h2>
  <a href="#" class="button"> Go To State1 </a>
</div>
```

And the JS:

```javascript
var S1Controller = {
  init: function() {
    var self = this;
    this.el = document.querySelector('#state-1');
    this.el.querySelector('.button').addEventListener('click', function() {
      self.transitions['state-2']();
    });
  },
  activate: function() {
    this.el.style.display = 'block';
  },
  deactivate: function() {
    this.el.style.display = 'none';
  },
};
var S2Controller = {
  init: function() {
    var self = this;
    this.el = document.querySelector('#state-2');
    this.el.querySelector('.button').addEventListener('click', function() {
      self.transitions['state-3']();
    });
  },
  activate: function() {
    this.el.style.display = 'block';
  },
  deactivate: function() {
    this.el.style.display = 'none';
  },
};
var S3Controller = {
  init: function() {
    var self = this;
    this.el = document.querySelector('#state-3');
    this.el.querySelector('.button').addEventListener('click', function() {
      self.transitions['state-1']();
    });
  },
  activate: function() {
    this.el.style.display = 'block';
  },
  deactivate: function() {
    this.el.style.display = 'none';
  },
};
var sm = Wrlx.StateMachine.create(function (sm) {
  sm.define_state('state-1', function (st) {
    st.controller(S1Controller);
    st.transitions_to('state-2', 'state-3');
  });
  sm.define_state('state-2', function (st) {
    st.controller(S2Controller);
    st.transitions_to('state-1', 'state-3');
  });
  sm.define_state('state-3', function (st) {
    st.controller(S3Controller);
    st.transitions_to('state-1');
  });
  sm.change('state-1');
});

window.onload = sm.start;
```

### Elements.js

I usually structure my javascript by 'widget', with a view object responsible or rendering some template and handling the DOM events, and I find it really annoying when half of the code is just for capturing DOM nodes inside the template. Is a repetitive, dull tasks that adds unneccesary noise. So here is `Elements.js` to help with that.

The inspiration here comes from the fine library `Knockout.js`. It uses the HTML5 `data` attribute to bind elements and events to `ko.observables` and the resulting code is small and clean. But, as nice as it is, `Knockout.js` does a lot of other things that I don't always need. I also wanted to use a similar binding style but with a more traditional mvc-ish code. I wrote `Elements.js` tyring to keep it as simple (and short) as it can get, to distil the bare funtionality and peel off everything else. As a result, it's quite spartan but around 30 loc.

Let's see a simple example (jQuery or a browser with `querySelector` support needed):

In the HTML:

```html
<div id="container">
  <label> Type something here: </label>
  <input type="text" data-el="input.text"/>
  <h5 data-el="header"></h5> 
</div>
```

and in the js:

```javascript
var TestView = {
  init: function () {
    this.ui = Wrlx.Elements('#container')
    this.bind_events();
  },
  bind_events: function () {
    var self = this;
    this.ui.input.text.addEventListener('keyup', function() {
      self.ui.header.innerHTML = self.ui.input.text.value;
    });
  }
}

window.onload = function() {
  TestView.init();
};
```
