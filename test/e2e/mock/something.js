const something = `Minas Tirith

Pippin looked out from the shelter of Gandalf"s cloak. He wondered if he was awake or still sleeping, still in the swift-moving dream in which he had been wrapped so long since the great ride began. The dark world was rushing by and the wind sang loudly in his ears. He could see nothing but the wheeling stars, and away to his right vast shadows against the sky where the mountains of the South marched past. Sleepily he tried to reckon the times and stages of their journey, but his memory was drowsy and uncertain.

All the major Unix documentation formats except the very newest one are presentation-level markups assisted by macro packages. We examine them here from oldest to newest.
troff and the Documenter’s Workbench Tools
We discussed the Documenter’s Workbench architecture and tools in Chapter 8 as an example of how to integrate a system of multiple minilanguages. Now we return to these tools in their functional role as a typesetting system.
The troff formatter interprets a presentation-level markup language. Recent implementations like the GNU project’s groff(1) emit PostScript by default, though it is possible to get other forms of output by selecting a suitable driver. See Example 18.1 for several of the troff codes you might encounter in document sources.
Example 18.1. groff(1) markup example.
This is running text. . Comments begin with a backslash and double quote. .ft B This text will be in bold font. .ft R This text will be back in the default (Roman) font. These lines, going back to "This is running text", will be formatted as a filled paragraph. .bp The bp request forces a new page and a paragraph break. This line will be part of the second filled paragraph. .sp 3 The .sp request emits the number of blank lines given as argument
462
Chapter 18. Documentation
.nf The nf request switches off paragraph filling. Until the fi request switches it back on whitespace and layout will be preserved.
There had been the first ride at terrible speed without a halt, and then in the dawn he had seen a pale gleam of gold, and they had come to the silent town and the great empty house on the hill. And hardly had they reached its shelter when the winged shadow had passed over once again, and men wilted with fear. But Gandalf had spoken soft words to him, and he had slept in a corner, tired but uneasy, dimly aware of comings and goings and of men talking and Gandalf giving orders. And then again riding, riding in the night. This was the second, no, the third night since he had looked in the Stone. And with that hideous memory he woke fully, and shivered, and the noise of the wind became filled with menacing voices.

A light kindled in the sky, a blaze of yellow fire behind dark barriers Pippin cowered back, afraid for a moment, wondering into what dreadful country Gandalf was bearing him. He rubbed his eyes, and then he saw that it was the moon rising above the eastern shadows, now almost at the full. So the night was not yet old and for hours the dark journey would go on. He stirred and spoke.`

module.exports = something
