/**
 * Google Analytics Wizard.
 */

/**
 * WordPress dependencies
 */
import { Component, render, Fragment } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { Dashicon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { withWizard, FormattedHeader, Handoff } from '../../components/src';
import GoogleAnalyticsSetup from './views/googleAnalyticsSetup';
import './style.scss';

/**
 * External dependencies
 */
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

/**
 * Subscriptions wizard for managing and setting up subscriptions.
 */
class GoogleAnalyticsWizard extends Component {
	/**
	 * Constructor.
	 */
	constructor() {
		super( ...arguments );
		this.state = {
			complete: false,
		};
	}

	/**
	 * Check completion status when wizard is ready.
	 */
	onWizardReady = () => {
		this.refreshComplete();
	};

	/**
	 * When the wizard is marked complete, mark the checklist item complete.
	 */
	componentDidUpdate( prevProps, prevState ) {
		const { complete: alreadyComplete } = prevState;
		const { complete } = this.state;
		if ( ! alreadyComplete && complete ) {
			this.markWizardComplete();
		}
	}

	/**
	 * Get whether Analytics setup is complete.
	 */
	refreshComplete() {
		const { setError, wizardApiFetch } = this.props;
		return wizardApiFetch( { path: '/newspack/v1/wizard/newspack-google-analytics-wizard/analytics-setup-complete' } )
			.then( complete => {
				return new Promise( resolve => {
					this.setState(
						{
							complete,
						},
						() => {
							setError();
							resolve( this.state );
						}
					);
				} );
			} )
			.catch( error => {
				this.setError( error );
			} );
	}

	/**
	 * Mark this wizard as complete.
	 */
	markWizardComplete() {
		const { setError } = this.props;
		return new Promise( ( resolve, reject ) => {
			apiFetch( {
				path: '/newspack/v1/wizards/google-analytics/complete',
				method: 'post',
				data: {},
			} )
				.then( response => {
					setError().then( () => resolve() );
				} )
				.catch( error => {
					setError( error ).then( () => reject() );
				} );
		} );
	}

	/**
	 * Render.
	 */
	render() {
		const { pluginRequirements } = this.props;
		const { complete } = this.state;
		return (
			<HashRouter hashType="slash">
				<Switch>
					{ pluginRequirements }
					<Route
						path="/"
						exact
						render={ routeProps => (
							<GoogleAnalyticsSetup
								headerText={ __( 'Google Analytics' ) }
								subHeaderText={ __( 'Connect to your Google Analytics account using the Site Kit plugin.' ) }
								complete={ complete }
								noBackground
							/>
						) }
					/>
				</Switch>
			</HashRouter>
		);
	}
}

render(
	createElement(
		withWizard( GoogleAnalyticsWizard, [
			'google-site-kit',
		] ),
		{
			buttonText: __( 'Back to dashboard' ),
			buttonAction: newspack_urls['dashboard'],
		}
	),
	document.getElementById( 'newspack-google-analytics-wizard' )
);