(function (exports) {

  var SM = {
    get_state: function (state_id) {
      return this.states[state_id];
    },
    change: function (new_state, params) {
      if (this.current_state) { this.current_state.deactivate(); }
      if (typeof new_state == 'string') {
        new_state = this.get_state(new_state)
      }
      this.current_state = new_state;
      new_state.activate(params);
    },
    define_state: function (id, fn) {
      var state = Object.create(State);
      state._init(this);
      fn(state);
      state._after_init();
      this.states || (this.states = {});
      this.states[id] = state;
    }
  };

  var State = {
    _init: function (sm) {
      this.transitions = {};
      this.sm = sm;
      this.st = {}
    },
    _after_init: function () {
      if (this.st.controller && this.st.controller.init) {
        this.st.controller.init(this.sm);
      }
    },
    activate: function (params) {
      if (this.st.controller && this.st.controller.activate) {
        this.st.controller.activate(params);
      }
    },
    deactivate: function (params) {
      if (this.st.controller && this.st.controller.deactivate) {
        this.st.controller.deactivate(params);
      }
    },
    controller: function (obj) {
      this.st.controller = obj;
    },
    transitions_to: function () {
      var transitions = Array.prototype.splice.call(arguments, 0);
      this.transitions = get_allowed_transitions(this, this.sm, transitions);
      if (this.st.controller) {
        this.st.controller.transitions = this.transitions;
      }
    }
  };

  // CHANGELOG: Added async state planning
  function get_allowed_transitions(state, sm, transition_data) {
    var transitions = {};
    transition_data.forEach(function (state_id) {
      transitions[state_id] = function (params, cb) {
        // Inmediate change
        sm.change(state_id, params);
        if (cb != undefined && typeof(cb) == 'function') {
          // Next, async state change changed planed on cb
          cb(function (next_state_id, more_params) {
            more_params || (more_params = {});
            for (var prop in more_params) if (more_params.hasOwnProperty(prop)) {
              params[prop] = more_params[prop];
            }
            sm.change(next_state_id, params);
          });
        }
      };
    });
    return transitions;
  }

  var StateMachineFacade = {
    create: function (fn) {
      var sm = Object.create(SM);
      sm.start = function () {
        fn(sm);
      };
      return sm;
    }
  };

  exports['StateMachine'] = StateMachineFacade;

})(this.Wrlx || (this.Wrlx = {}));
