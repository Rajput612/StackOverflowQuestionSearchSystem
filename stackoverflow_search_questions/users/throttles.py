from rest_framework.throttling import AnonRateThrottle,UserRateThrottle
#Throttling for Logged in User
class UserMinThrottle(UserRateThrottle):
    scope = 'users_min'


class UserDayThrottle(UserRateThrottle):
    scope = 'users_day'


#Non Logged in user
class AnonymousMinThrottle(AnonRateThrottle):
    scope = 'anon_min'


class AnonymouseDayThrottle(AnonRateThrottle):
    scope = 'anon_day'