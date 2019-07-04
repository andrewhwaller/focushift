class AddUserIdToPartnerships < ActiveRecord::Migration[5.2]
  def change
    add_column :partnerships, :user_id, :integer
  end
end
