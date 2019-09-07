class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
  :recoverable, :rememberable, :validatable, :timeoutable, :omniauthable, omniauth_providers: [:facebook]
  has_many :tasks
  has_many :projects
  has_many :contexts
  has_many :partnerships
  has_many :partners, through: :partnerships  

  def self.from_omniauth(auth)
  # Either create a User record or update it based on the provider (Google) and the UID   
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.token = auth.credentials.token
      user.expires = auth.credentials.expires
      user.expires_at = auth.credentials.expires_at
      user.refresh_token = auth.credentials.refresh_token
      user.email = auth.info.email
      user.provider = auth.provider
      user.uid = auth.uid
      user.password = Devise.friendly_token[0,20]
      parse_name(user, auth.info.name)
    end
  end

  private
  def self.parse_name(user, name)
    name_arr = name.split(“ “)
    user.last_name = name_arr.pop
    user.first_name = name_arr.join(“ “)
  end
end
