/**
 * Pop-ups wizard screen.
 */

/**
 * WordPress dependencies.
 */
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * External dependencies.
 */
import { find } from 'lodash';

/**
 * Internal dependencies
 */
import { withWizardScreen, ActionCardSections } from '../../../../components/src';
import PopupActionCard from '../../components/popup-action-card';

/**
 * Popup group screen
 */

class PopupGroup extends Component {
	/**
	 * Construct the appropriate description for a single Pop-up based on categories and sitewide default status.
	 *
	 * @param {Object} popup object.
	 */
	descriptionForPopup = (
		{ categories, sitewide_default: sitewideDefault, options },
		segments
	) => {
		const segment = find( segments, [ 'id', options.selected_segment_id ] );
		const descriptionMessages = [];
		if ( segment ) {
			descriptionMessages.push( `${ __( 'Segment:', 'newspack' ) } ${ segment.name }` );
		}
		if ( sitewideDefault ) {
			descriptionMessages.push( __( 'Sitewide default', 'newspack' ) );
		}
		if ( categories.length > 0 ) {
			descriptionMessages.push(
				__( 'Categories: ', 'newspack' ) + categories.map( category => category.name ).join( ', ' )
			);
		}
		return descriptionMessages.length ? descriptionMessages.join( ' | ' ) : null;
	};

	/**
	 * Render.
	 */
	render() {
		const {
			deletePopup,
			emptyMessage,
			items: { active = [], draft = [], test = [], inactive = [] },
			previewPopup,
			setCategoriesForPopup,
			setSitewideDefaultPopup,
			publishPopup,
			updatePopup,
			segments,
		} = this.props;

		const getCardClassName = ( { key }, { sitewide_default } ) =>
			( {
				active: sitewide_default ? 'newspack-card__is-primary' : 'newspack-card__is-supported',
				test: 'newspack-card__is-secondary',
				inactive: 'newspack-card__is-disabled',
				draft: 'newspack-card__is-disabled',
			}[ key ] );

		return (
			<ActionCardSections
				sections={ [
					{ key: 'active', label: __( 'Active', 'newspack' ), items: active },
					{ key: 'draft', label: __( 'Draft', 'newspack' ), items: draft },
					{ key: 'test', label: __( 'Test', 'newspack' ), items: test },
					{ key: 'inactive', label: __( 'Inactive', 'newspack' ), items: inactive },
				] }
				renderCard={ ( popup, section ) => (
					<PopupActionCard
						className={ getCardClassName( section, popup ) }
						deletePopup={ deletePopup }
						description={ this.descriptionForPopup( popup, segments ) }
						key={ popup.id }
						popup={ popup }
						previewPopup={ previewPopup }
						setCategoriesForPopup={ setCategoriesForPopup }
						setSitewideDefaultPopup={ setSitewideDefaultPopup }
						updatePopup={ updatePopup }
						publishPopup={ section.key === 'draft' ? publishPopup : undefined }
					/>
				) }
				emptyMessage={ emptyMessage }
			/>
		);
	}
}

export default withWizardScreen( PopupGroup );
