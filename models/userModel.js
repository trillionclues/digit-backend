const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Schema = mongoose.Schema;
const saltRounds = 10;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    cart: {
      type: Array,
      default: [],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    address: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    refreshToken: {
      type: String,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

// password hash
userSchema.pre('save', async function (next) {
  // check if password is modified, encrypt again...
  if (!this.isModified('password')) {
    return next(); // Don't rehash if not modified
  }

  // password encryption
  const genSalt = await bcrypt.genSaltSync(saltRounds);
  this.password = await bcrypt.hash(this.password, genSalt);

  next(); // Continue with the save operation
});

// compare entered password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// create reset token
userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update('resetToken')
    .digest('hex');

  // set expiration time
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 10mins
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
