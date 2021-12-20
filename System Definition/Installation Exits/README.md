# AdminOnlyLogin

AdminOnlyLogin is an installation exit that overwrites the default Login installation exit. The purpose of this installation exit is to prevent non-authorized users from accessing the Dev and Test instances.

By default, admins can always login to an instance were this installation exit is enabled. Additional users can be authorized by adding them to a custom group. Which group is used in the installation exit can be controlled by a system property.
