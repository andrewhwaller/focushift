# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_09_23_181741) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "adminpack"
  enable_extension "plpgsql"

  create_table "contexts", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.string "name"
    t.string "location"
  end

  create_table "contexts_projects", id: false, force: :cascade do |t|
    t.integer "context_id"
    t.integer "project_id"
  end

  create_table "partnerships", force: :cascade do |t|
    t.integer "user_id"
    t.integer "partner_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.index ["partner_id"], name: "index_partnerships_on_partner_id"
    t.index ["user_id"], name: "index_partnerships_on_user_id"
  end

  create_table "project_contexts", force: :cascade do |t|
    t.bigint "project_id"
    t.bigint "context_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["context_id"], name: "index_project_contexts_on_context_id"
    t.index ["project_id"], name: "index_project_contexts_on_project_id"
  end

  create_table "project_partnerships", force: :cascade do |t|
    t.bigint "project_id"
    t.bigint "partnership_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["partnership_id"], name: "index_project_partnerships_on_partnership_id"
    t.index ["project_id"], name: "index_project_partnerships_on_project_id"
  end

  create_table "projects", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.integer "status", default: 0
    t.string "name"
    t.date "due_date"
    t.text "description"
  end

  create_table "tasks", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.date "due_date"
    t.text "description"
    t.integer "status", default: 0
    t.integer "project_id"
    t.string "duration"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "provider"
    t.string "uid"
    t.string "token"
    t.integer "expires_at"
    t.boolean "expires"
    t.string "refresh_token"
    t.string "first_name"
    t.string "last_name"
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "partnerships", "users"
  add_foreign_key "partnerships", "users", column: "partner_id"
  add_foreign_key "project_contexts", "contexts"
  add_foreign_key "project_contexts", "projects"
  add_foreign_key "project_partnerships", "partnerships"
  add_foreign_key "project_partnerships", "projects"
end
