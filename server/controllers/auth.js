import bcrpt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const me = async (req, res) => {
    const user = await User.findByPk(req.userId, {
    attributes: { exclude: ['password'] }
    });
    res.status(200).json({user});
}

export const signup = async (req, res) => {
    const { firstName, lastName, username, email,} = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrpt.hash(req.body.password, 10);
    const user = await User.create({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
    });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    res.cookie('token', token, cookieOptions);

    const isAdmin = user.role === 'Admin';

    res.status(201).json({
         success: 'welcome ' + user.username + ' to Belsy',
         user: { 
            id: user.id,
            firstName: user.firstName, 
            lastName: user.lastName, 
            username: user.username, 
            email: user.email,
            role: user.role
        },
         token,
         isProduction,
         isAdmin
    });
}

export const signin = async (req, res) => {

    const { identifier, password } = req.body;
    const user = await User.findOne({ where: {
        [Op.or]: [
            { email: identifier },
            { username: identifier }
        ]
    }}).select('+password');
    if (!user) throw new Error('Invalid credentials', { cause: 401 });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials', { cause: 401 });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    res.cookie('token', token, cookieOptions);
    res.status(200).json({
        success: 'welcome ' + user.username + ' to Belsy',
        user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            role: user.role
        },
        token,
        isProduction
    });
}

export const signout = async (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 0, // Set maxAge to 0 to delete the cookie
    };
    res.clearCookie('token', cookieOptions);
    res.status(200).json({ message: 'Logged out successfully' });
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Generate reset token
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

  // Set reset fields in DB
  user.resetToken = hashedToken;
  user.resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes from now
  await user.save();

  // You would send an email with this token in a real app
  const resetURL = `https://your-frontend.com/reset-password/${rawToken}`;

  // For now, just log the reset URL (simulate sending email)
  console.log(`🔑 Reset password link: ${resetURL}`);

  res.status(200).json({ message: 'Password reset link sent (check console).' });
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  // Hash the raw token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find user by hashed token and check expiry
  const user = await User.findOne({
    where: {
      resetToken: hashedToken,
      resetTokenExpires: {
        [Op.gt]: Date.now()
      }
    }
  });

  if (!user) {
    return res.status(400).json({ message: 'Token is invalid or has expired' });
  }

  // Hash new password
  const hashedPassword = await bcrpt.hash(newPassword, 10);

  // Update user
  user.password = hashedPassword;
  user.resetToken = null;
  user.resetTokenExpires = null;
  await user.save();

  res.status(200).json({ message: 'Password has been reset successfully' });
};
