class ChangeUserIdToBeIntegerInPartnerships < ActiveRecord::Migration[5.2]
  def change
    change_column :partnerships, :user_id, :integer
  end
end
