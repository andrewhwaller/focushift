class CreatePartnerships < ActiveRecord::Migration[5.2]
  def change
    create_table :partnerships do |t|
      t.references :user, index: true, foreign_key: true
      t.references :partner, index: true
      t.timestamps null: false
    end

    add_foreign_key :partnerships, :users, column: :partner_id
  end
end
