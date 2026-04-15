This project was created using Claude Code in April 2026 with the CC-native Superpowers plugin https://github.com/pcvelz/superpowers

Rough process:
* Think of the idea and jotted down features I wanted
* Prepare a decent starting prompt
* Run `claude` and begin the Superpowers workflow
```
/plugin install superpowers-extended-cc@superpowers-extended-cc-marketplace
/superpowers-extended-cc:brainstorm    
```

The original prompt was "A React v19 app for a garden. It should allow plot size of 10 to 200 sq ft and selecting a set of plants with light condition filter (direct/partial/low) and provide a reference calendar of growing and harvest times based only on the docs/ PDFs."
Brainstorming with Claude helped refine the final design.

After reviewing the design spec, we went on to writing the implementation plans, and then creating the app itself using Superpowers agentic test-driven development:
```
/superpowers-extended-cc:writing-plans
/superpowers-extended-cc:executing-plans
```

The Superpowers md files are available in a older state of the repo here: https://github.com/joshuadfranklin/simple-garden-react-spa/tree/361491594b164999725e155cace4f913708f94a0/docs/superpowers

For this small project I did not need any feature branches.

