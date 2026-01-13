import authService from '../services/authService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.register(req.body);

  res.status(201).json({
    success: true,
    data: { user, token },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login(email, password);

  res.status(200).json({
    success: true,
    data: { user, token },
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.verifyToken(req.headers.authorization?.split(' ')[1]);

  res.status(200).json({
    success: true,
    data: user,
  });
});
