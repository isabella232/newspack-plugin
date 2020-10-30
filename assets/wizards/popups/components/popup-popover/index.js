/**
 * Popup Action Card
 */

/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import { MenuItem } from '@wordpress/components';
import { ESCAPE } from '@wordpress/keycodes';

/**
 * Material UI dependencies.
 */
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import PreviewIcon from '@material-ui/icons/Visibility';
import FrequencyIcon from '@material-ui/icons/Today';
import PublishIcon from '@material-ui/icons/Publish';
import TestIcon from '@material-ui/icons/BugReport';
import SitewideDefaultIcon from '@material-ui/icons/Public';

/**
 * Internal dependencies.
 */
import { Popover, SelectControl, ToggleControl } from '../../../../components/src';
import { isOverlay } from '../../utils';
import './style.scss';

const frequencyMap = {
	never: __( 'Never', 'newspack' ),
	once: __( 'Once', 'newspack' ),
	daily: __( 'Once a day', 'newspack' ),
	always: __( 'Every page', 'newspack' ),
};

const frequenciesForPopup = popup => {
	return Object.keys( frequencyMap )
		.filter( key => ! ( 'always' === key && isOverlay( popup ) ) )
		.map( key => ( { label: frequencyMap[ key ], value: key } ) );
};

class PopupPopover extends Component {
	/**
	 * Render.
	 */
	render = () => {
		const {
			deletePopup,
			popup,
			previewPopup,
			setSitewideDefaultPopup,
			onFocusOutside,
			publishPopup,
			updatePopup,
		} = this.props;
		const { id, sitewide_default: sitewideDefault, edit_link: editLink, options, status } = popup;
		const { frequency } = options;
		const isDraft = 'draft' === status;
		const isTestMode = 'test' === frequency;
		return (
			<Popover
				position="bottom left"
				onFocusOutside={ onFocusOutside }
				onKeyDown={ event => ESCAPE === event.keyCode && onFocusOutside() }
			>
				{ isOverlay( { options } ) && ! isTestMode && ! isDraft && (
					<MenuItem
						onClick={ () => {
							setSitewideDefaultPopup( id, ! sitewideDefault );
							onFocusOutside();
						} }
						icon={ <SitewideDefaultIcon /> }
						className="newspack-button"
					>
						{ __( 'Sitewide default', 'newspack' ) }
						<ToggleControl
							className="newspack-popup-action-card-popover-control"
							checked={ sitewideDefault }
							onChange={ () => null }
						/>
					</MenuItem>
				) }
				<MenuItem
					onClick={ () => {
						updatePopup( id, { frequency: isTestMode ? 'daily' : 'test' } );
						onFocusOutside();
					} }
					icon={ <TestIcon /> }
					className="newspack-button"
				>
					{ __( 'Test mode', 'newspack' ) }
					<ToggleControl
						className="newspack-popup-action-card-popover-control"
						checked={ isTestMode }
						onChange={ () => null }
					/>
				</MenuItem>
				{ 'test' !== frequency && (
					<MenuItem icon={ <FrequencyIcon /> } className="newspack-button">
						<SelectControl
							onChange={ value => {
								updatePopup( id, { frequency: value } );
								onFocusOutside();
							} }
							options={ frequenciesForPopup( popup ) }
							value={ frequency }
						/>
					</MenuItem>
				) }
				<MenuItem
					onClick={ () => {
						onFocusOutside();
						previewPopup( popup );
					} }
					icon={ <PreviewIcon /> }
					className="newspack-button"
				>
					{ __( 'Preview', 'newspack' ) }
				</MenuItem>
				<MenuItem
					href={ decodeEntities( editLink ) }
					icon={ <EditIcon /> }
					className="newspack-button"
					isLink
				>
					{ __( 'Edit', 'newspack' ) }
				</MenuItem>
				{ publishPopup && (
					<MenuItem
						onClick={ () => publishPopup( id ) }
						icon={ <PublishIcon /> }
						className="newspack-button"
					>
						{ __( 'Publish', 'newspack' ) }
					</MenuItem>
				) }
				<MenuItem
					onClick={ () => deletePopup( id ) }
					icon={ <DeleteIcon /> }
					className="newspack-button"
				>
					{ __( 'Delete', 'newspack' ) }
				</MenuItem>
			</Popover>
		);
	};
}

export default PopupPopover;
