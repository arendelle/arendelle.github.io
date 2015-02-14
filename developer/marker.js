
//
// Marker.js, Port of the original Cliff.Highlights
// Copyright 2015 Pouya Kary <k@arendelle.org> 
//


//
// INFO
//

var version = '0.006';



//
// TAGS
//

var start        = '<span style="color: #';
var bold_start   = '<span style="font-weight: bold; color: #';
var middle       = ';">';
var end          = '</span>';
var start_header = '<!-- [+] Marker.js ' + version + ' : Code Block -->\n\n<pre><code>';
var end_header   = '</code></pre>\n\n<!-- [-] Marker.js ' + version + ' : Code Block -->';



//
// COLORS
//

var loop_color     = "D60073";
var data_color     = "4E00FC";
var comment_color  = "A0A0A0";
var string_color   = "BD00AD"; 
var number_color   = "6200A8";
var function_color = "8C007F";



///
/// MARKER
///

function mark (text) {

	return start_header + highlight ( text ) + end_header ;

}

///
/// Returns highlighted 'text' value
///

function highlight (text) {

	text = text.replace(/\</g,'&lt;').replace(/\>/g,'&gt;');

	var result   = '';

	for ( var i = 0; i < text.length; i++ ) {

		var reading_char = text[i];

		switch (reading_char) {


			//
			// GRAMMARS
			//

			case '[':
			case ']':
			case ')':
			case '<':
			case '>':
			case '{':
			case '}':
			case ';':
			case ',':

				result += start + loop_color + middle + reading_char + end;
				break;




			//
			// ( space name highlighter , 0 )
			//

			case '(':

				result += start + loop_color + middle + reading_char + end;

				var space_init_string = '';
				var while_control_6   = true;
				
				i++;

				while ( i < text.length && while_control_6 ) {

					if ( text[ i ] == ')' || text[ i ] == ',' ) {

						if ( /[a-zA-Z0-9]/g.test( space_init_string ) ) {

							result += start + data_color + middle + space_init_string + end;
							
						} else {

							result += start + data_color + middle + "12" + end;

						}

						result += start + loop_color + middle + text[ i ] + end;
						while_control_6 = false;

					} else {

						space_init_string += text[ i ];

					}

					i++;
				}
				
				i--;
				break;




			//
			// NUMERICS
			//

			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
			case '.':

				var number_string   = '';
				var while_control_1 = true;

				number_string += reading_char; i++;

				while ( i < text.length && while_control_1 ) {

					if ( /[0-9\.]/g.test( text[ i ] ) ) {

						number_string += text[ i ];

					} else {

						while_control_1 = false;
						i--;
						break;

					}

					i++;
				}

				result += start + number_color + middle + number_string + end;
				break;




			//
			// { SPACE, SOURCE, STORED SPACE, FUNCTIONS 
			//

			case '@':
			case '#':
			case '!':
			case '$':

				var data_string      = '';
				var while_control_2  = true;

				data_string += reading_char; i++;
				
				while ( i < text.length && while_control_2 ) {

					if ( /[a-zA-Z0-9\?\. 3]/g.test( text[ i ] ) ) {

						data_string += text[ i ];

					} else {

						while_control_2 = false;
						i--;
						break;

					}

					i++;
				}

				result += start + data_color + middle + data_string + end;
				break;




			//
			// COMMENTS
			//

			case '/':


				var comment_string = '';
				
				if ( i < text.length - 1 ) {

					i++;

					if ( text[ i ] == '/' ) {

						comment_string = '//'; i++;

						while ( i < text.length && text[ i ] != '\n' ) {

							comment_string += text[ i ];
							i++;

						}

						result += start + comment_color + middle + comment_string + end;
						i--;

					} else if ( text[ i ] == '*' ) {

						i++; comment_string  = '/*'; 
						var  while_control_5 = true;

						while ( i < text.length && while_control_5 ) {

							if ( text[ i ] == '*' && i < text.length -1 ) {

								i++;
								if ( text[ i ] == '/' ) {

									comment_string += '*/';
									while_control_5 = false;

								} else {
									comment_string += '*' + text[i];
									i++;
								}						

							} else {
								comment_string += text[ i ];
								i++;
							}
						}

						result += start + comment_color + middle + comment_string + end;

					} else {
						result += '/' + text[ i ];
					}

				} else {
					result += '/';
				}

				break;




			//
			// STRINGS
			//

			case "'":
			case '"':

				var string_string   = '';
				var string_sign     = reading_char;
				var while_control_3 = true; 

				i++;

				//
				// STRING READER
				//

				while ( i < text.length && while_control_3 ) {

					switch ( text[ i ] ) {

						case string_sign :
							result += start + string_color + middle + string_sign + string_string + string_sign + end;
							while_control_3 = false; i--;
							break;

						//
						// SCAPE SEQUANCE READER
						// 

						case '\\':
							i++;

							switch (text[ i ]) {

								//
								// STRING REPLACER READER
								//

								case '(':

									var while_control_4        = true;
									var string_replacer_string = '';
									var indent_level		   = 0;

									
									while ( i < text.length && while_control_4 ) {

										i++;

										if ( text[ i ] == '(' ) {

											indent_level++;

										} else if ( text[ i ] == ')' ) {

											if ( indent_level == 0 ) {

												while_control_4 = false; i++;
												string_string += end + "\\(" + highlight ( string_replacer_string ) + ")" + start + string_color + middle;

											}

											indent_level--;

										} else {

											string_replacer_string += text[ i ];

										}
									}

									break;

									//
									// DONE: STRING REPLACER READER
									//

								default:
									string_string += start + data_color + middle + '\\' + text[ i ] + end;
									i++;

							}

							i--;
							break;

							//
							// DONE: SCAPE SEQUANCE READER
							//

						default:
							string_string += text[ i ];
					}

					i++;
				}

				break;

				//
				// DONE: STRING READER
				//




			//
			// WHITESPACE HANDLERS
			//

			case '\n':
				result += "<br>";
				break;

			case ' ':
				result += "&nbsp;";
				break;

			case '\t':
				result += "&nbsp;&nbsp;&nbsp;";
				break;

			default:
				result += reading_char;
		}

	}

	return result ;
}

//
// DONE
//
