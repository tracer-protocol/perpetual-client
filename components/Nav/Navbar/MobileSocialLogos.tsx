
import Icon, { GithubOutlined, TwitterOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import DiscordLogo from 'public/img/logos/socials/discord-logo-white.svg';
import DiscourseLogo from 'public/img/logos/socials/discourse-logo-white.svg';

export default styled(props => (
	<div {...props}>
		<a href="https://discourse.tracer.finance/" target="_blank" rel="noreferrer noopener">
			<Icon component={DiscourseLogo}/>
		</a>
		<a href="https://github.com/tracer-protocol/" target="_blank" rel="noreferrer noopener">
			<GithubOutlined />
		</a>
		<a href="https://discord.gg/sS7QFWWyYa" target="_blank" rel="noreferrer noopener">
			<Icon component={DiscordLogo}/>
		</a>
		<a href="https://twitter.com/tracer_finance" target="_blank" rel="noreferrer noopener">
			<TwitterOutlined />
		</a>
	</div>
))`
	width: 100%;
	height: 100%;
	max-width: 38rem;
	display: flex;
	font-size: 2rem;
	justify-content: space-between;
	align-items: center;
	& > *:hover,
	& > *:focus,
	& > *:active {
		color: var(--color-primary);
		fill: var(--color-primary);
	}
`