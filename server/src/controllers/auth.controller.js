// DigitalEra - Auth Controller
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const config = require('../config/env');

/**
 * @desc   Register a new admin user
 * @route  POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, dob, gender, city, pincode, avatar } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { 
        name, 
        email, 
        password: hashedPassword,
        dob: dob ? new Date(dob) : null,
        gender,
        city,
        pincode,
        avatar
      },
      select: { id: true, name: true, email: true, role: true, avatar: true },
    });

    res.status(201).json({ message: 'User registered successfully.', user });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Login user & set JWT cookie
 * @route  POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Set httpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: 'Login successful.',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Logout user & clear cookie
 * @route  POST /api/auth/logout
 */
const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully.' });
};

/**
 * @desc   Get current user profile
 * @route  GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        role: true, 
        avatar: true, 
        dob: true, 
        gender: true, 
        city: true, 
        pincode: true, 
        createdAt: true 
      },
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, logout, getMe };
