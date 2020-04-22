---
layout: page
path: /guides/components.html
---

# Front-End Components

In Saur, Components are objects coupled to HTML elements, which respond
to their events. For the most part, the assumption is that components
are JS code for your existing HTML that is rendered on the server using
the Saur framework.

A component is instantiated when an element matching its `selector`
appears in the DOM, whether on a page load or asynchronously, and can be
defined by setting the `.selector` attribute on your Component class:

```javascript
import Component from "saur/ui/component";

class AlertLink extends Component {
  show() {
    alert(this.element.href);
  }
}

AlertLink.selector = "[data-alert-link]";

export default AlertLink
```

To bind events to this component, you can set them on the `.events`
configuration on the class level:

```javascript
import Component from "saur/ui/component";

class AlertLink extends Component {
  show(event) {
    event.preventDefault();
    alert(this.element.href);
  }
}

AlertLink.selector = "[data-alert-link]";
AlertLink.events.click = ["show"];

export default AlertLink
```

Now, you can write HTML like the following, and expect the href to be
shown in an alert dialog:

```html
<a href="https://example.com" data-alert-link>Red Alert!</a>
```

## Decorator Support

Decorator functions are also supported for those environments which can
handle them. Since this isn't an official part of ECMAScript yet,
decorators are only an alternative syntax sugar to the described methods
above, but can result in much more expressive code. Here's the
aforementioned component rewritten to use decorators:

```javascript
import Component from "saur/ui/component";
import { element, on } from "saur/ui/decorators";

@element("[data-alert-link]");
export default class AlertLink extends Component {
  @on("click");
  show(event) {
    event.preventDefault();
    alert(this.element.href);
  }
}
```

These decorators only serve to manipulate the static `.events` and
`.selector` properties of your Component class, so you don't have to
manipulate them directly. They don't add any additional functionality
that you can't get from a standard Webpack configuration.
