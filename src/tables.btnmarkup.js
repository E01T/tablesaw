/*
* Button Markup
* Custom-styled native inputs/buttons.
*
* Copyright (c) 2012 Filament Group, Inc.
* Licensed MIT
*/

(function( $ ) {
	var pluginName = "btn",
		initSelector = "." + pluginName,
		activeClass = "btn-selected",
		methods = {
			_create: function(){
				return $( this ).each(function() {
					$( this )
						.trigger( "beforecreate." + pluginName )
						[ pluginName ]( "_init" )
						.trigger( "create." + pluginName );
				});
			},
			_init: function(){
				var oEl = $( this ),
					disabled = this.disabled !== undefined && this.disabled !== false,
					input = this.getElementsByTagName( "input" )[ 0 ],
					sel = this.getElementsByTagName( "select" )[ 0 ];

				if( input ) {
					$( this )
						.addClass( "btn-" + input.type )
						[ pluginName ]( "_formbtn", input );
				}
				if( sel ) {
					$( this )
						.addClass( "btn-select" )
						[ pluginName ]( "_select", sel );
				}
				if( disabled ) {
					oEl.addClass( "ui-disabled" );
				}
				return oEl;
			},
			_formbtn: function( input ) {
				var active = function( el, input ) {
					if( input.type === "radio" && input.checked ) {
						var group = input.getAttribute( "name" );

						$( "[name='" + group + "']" ).each(function() {
							$( this ).parent().removeClass( activeClass );
						});
						el[ input.checked ? "addClass" : "removeClass" ]( activeClass );
					} else if ( input.type === "checkbox" ) {
						el[ input.checked ? "addClass" : "removeClass" ]( activeClass );
					}
				};

				active( $( this ), input );
				$( this ).bind("click", function() {
					active( $( this ), input );
				});
			},
			_select: function( sel ) {
				var update = function( oEl, sel ) {
					var opts = $( sel ).find( "option" ),
						label, el, children;

					opts.each(function() {
						var opt = this;
						if( opt.selected ) {
							label = document.createTextNode( opt.text );
						}
					});

					children = oEl.childNodes;
					if( opts.length > 0 ){
						for( var i = 0, l = children.length; i < l; i++ ) {
							el = children[ i ];

							if( el && el.nodeType === 3 ) {
								oEl.replaceChild( label, el );
							}
						}
					}
				};

				update( this, sel );
				$( this ).bind( "change refresh", function() {
					update( this, sel );
				});
			}
		};

	// Collection method.
	$.fn[ pluginName ] = function( arrg, a, b, c ) {
		return this.each(function() {

		// if it's a method
		if( arrg && typeof( arrg ) === "string" ){
			return $.fn[ pluginName ].prototype[ arrg ].call( this, a, b, c );
		}

		// don't re-init
		if( $( this ).data( pluginName + "active" ) ){
			return $( this );
		}

		// otherwise, init

		$( this ).data( pluginName + "active", true );
			$.fn[ pluginName ].prototype._create.call( this );
		});
	};

	// add methods
	$.extend( $.fn[ pluginName ].prototype, methods );

	// Kick it off when `enhance` event is fired.
	$( document ).on( "enhance", function( e ) {
		$( initSelector, e.target )[ pluginName ]();
	});

}( jQuery ));