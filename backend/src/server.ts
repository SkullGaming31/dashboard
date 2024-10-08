import express, { Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as DiscordStrategy, Profile } from 'passport-discord';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';

import { Guild } from './types/custom';
axios.defaults;

dotenv.config();

const app = express();

app.use(cors({
	origin: 'http://localhost:5173', // Allow requests from your frontend
	credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

passport.use(new DiscordStrategy(
	{
		clientID: process.env.DISCORD_CLIENT_ID as string,
		clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
		callbackURL: 'http://localhost:3000/api/v1/auth/discord/redirect',
		scope: ['identify', 'guilds'],
	},
	(accessToken, refreshToken, profile, done) => {
		const userProfile: Express.User = {
			id: profile.id, // Make sure this property is defined in the User interface
			username: profile.username,
			avatar: profile.avatar,
			discriminator: profile.discriminator,
			public_flags: profile.public_flags,
			flags: profile.flags,
			banner: profile.banner,
			accent_color: profile.accent_color,
			global_name: profile.global_name,
			mfa_enabled: profile.mfa_enabled,
			locale: profile.locale,
			premium_type: profile.premium_type,
			provider: profile.provider,
			accessToken: accessToken,
			refreshToken: refreshToken,
			// Map guilds from GuildInfo[] to Guild[]
			guilds: (profile.guilds || []).map(guild => ({
				...guild,
				permissions_new: String(guild.permissions) // Ensure permissions_new is included
			})) as Guild[]
		};

		return done(null, userProfile);
	}
));

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((obj: Express.User, done) => {
	done(null, obj);
});

app.use(
	session({
		secret: 'keyboard cat',
		resave: false,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/api/v1/auth/discord', passport.authenticate('discord'));

app.get('/api/v1/auth/discord/redirect',
	passport.authenticate('discord', { failureRedirect: '/' }),
	(req: Request, res: Response) => {
		res.redirect('http://localhost:5173');
	}
);

app.get('/api/v1/auth/logout', (req, res) => {
	req.logout(err => {
		if (err) {
			console.error('Logout error:', err);
			return res.status(500).send('Logout failed');
		}
		res.status(200).send({ message: 'Logged out successfully' }); // Send a success response
	});
});

app.get('/api/v1/auth/status', (req, res) => {
	// Check if user is authenticated
	if (req.isAuthenticated()) {
		res.status(200).send({ isLoggedIn: true });
	} else {
		res.status(401).send({ isLoggedIn: false });
	}
});


app.get('/dashboard', (req, res) => {
	if (!req.isAuthenticated()) return res.redirect('/');

	// Now TypeScript knows that req.user has the guilds property
	const guilds = (req.user as Express.User).guilds || [];

	// Define the permission bit for ManageGuild
	const MANAGE_GUILD_PERMISSION = BigInt(0x00000020); // Permission bit for ManageGuild

	// Filter guilds to include only those with ManageGuild permission
	const manageableGuilds = guilds.filter(guild => {
		const permissions = BigInt(guild.permissions_new); // Convert permissions to BigInt
		return (permissions & MANAGE_GUILD_PERMISSION) === MANAGE_GUILD_PERMISSION;
	});

	// Log the manageable guilds
	// console.log('Manageable Guilds:', manageableGuilds);

	// Optionally return the manageable guilds in the response
	res.json({ manageableGuilds }); // Adjust this line as needed for your response structure
});



// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));